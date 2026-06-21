import json
import logging
import re
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

logging.getLogger("pypdf").setLevel(logging.ERROR)

CHOICE_KEYS = ("ก", "ข", "ค", "ง", "จ")
CHOICE_INDEX = {key: index for index, key in enumerate(CHOICE_KEYS)}

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

def _center(obj):
    return ((obj["x0"] + obj["x1"]) / 2, (obj["top"] + obj["bottom"]) / 2)

def _choice_label_from_word(word):
    text = word["text"].replace(" ", "")
    if len(text) >= 2 and text[0] in CHOICE_KEYS and text[1] == ".":
        return text[0]
    return None

def _question_number_from_word(word):
    match = re.match(r"^(\d+)\.$", word["text"].strip())
    return int(match.group(1)) if match else None

def _is_star_marker(image):
    width = image.get("width", 0)
    height = image.get("height", 0)
    return 8 <= width <= 70 and 8 <= height <= 70

def _is_star_curve(curve):
    width = curve.get("width", 0)
    height = curve.get("height", 0)
    return (
        8 <= width <= 80
        and 8 <= height <= 80
        and (
            curve.get("stroking_color") == (1.0, 0.0, 0.0)
            or curve.get("non_stroking_color") == (0.929, 0.49, 0.192)
        )
    )

def _is_choice_highlight(curve):
    width = curve.get("width", 0)
    height = curve.get("height", 0)
    return (
        curve.get("stroking_color") == (1.0, 1.0, 0.0)
        and not curve.get("fill")
        and width >= 12
        and height <= 3
    )

def _infer_choice_from_marker_row(labels, marker_x, marker_y):
    near_labels = [
        label
        for label in labels
        if abs(label["x0"] - marker_x) <= 220
        and abs(label["cy"] - marker_y) <= 130
    ]
    if len(near_labels) < 2:
        return None

    near_labels.sort(key=lambda label: label["cy"])
    spacings = []
    for previous, current in zip(near_labels, near_labels[1:]):
        index_gap = CHOICE_INDEX[current["label"]] - CHOICE_INDEX[previous["label"]]
        if index_gap > 0:
            spacings.append((current["cy"] - previous["cy"]) / index_gap)

    if not spacings:
        return None

    spacing = sorted(spacings)[len(spacings) // 2]
    if spacing <= 0:
        return None

    candidates = []
    for label in near_labels:
        label_index = CHOICE_INDEX[label["label"]]
        for key, key_index in CHOICE_INDEX.items():
            expected_y = label["cy"] + (key_index - label_index) * spacing
            candidates.append((abs(expected_y - marker_y), key))

    distance, key = min(candidates, key=lambda item: item[0])
    return key if distance <= max(18, spacing * 0.65) else None

def extract_star_answers(pdf_path):
    if pdfplumber is None:
        raise RuntimeError(
            "Missing dependency: pdfplumber. Run with the bundled Python runtime "
            "or install it with `python -m pip install pdfplumber pypdf`."
        )

    answers = {}
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            words = page.extract_words(x_tolerance=2, y_tolerance=3, keep_blank_chars=False)
            labels = []
            question_numbers = []

            for word in words:
                cx, cy = _center(word)
                label = _choice_label_from_word(word)
                if label:
                    labels.append({**word, "label": label, "cx": cx, "cy": cy})

                question_number = _question_number_from_word(word)
                if question_number is not None:
                    question_numbers.append({**word, "number": question_number, "cx": cx, "cy": cy})

            markers = [image for image in page.images if _is_star_marker(image)]
            markers.extend(curve for curve in page.curves if _is_choice_highlight(curve))

            for marker in markers:
                marker_x, marker_y = _center(marker)
                label_candidates = [
                    label
                    for label in labels
                    if abs(label["cy"] - marker_y) <= 18
                    and marker["x0"] - 20 <= label["x0"] <= marker["x1"] + 120
                ]
                if not label_candidates:
                    inferred_label = _infer_choice_from_marker_row(labels, marker_x, marker_y)
                    if not inferred_label:
                        continue
                else:
                    label = min(
                        label_candidates,
                        key=lambda item: (abs(item["cy"] - marker_y), abs(item["x0"] - marker_x)),
                    )
                    inferred_label = label["label"]

                question_candidates = [
                    question
                    for question in question_numbers
                    if question["top"] <= marker_y + 12
                    and abs(question["x0"] - marker_x) <= 300
                ]
                if not question_candidates:
                    continue

                question = max(question_candidates, key=lambda item: item["top"])
                answers[question["number"]] = inferred_label

    return answers

MANUAL_ANSWER_OVERRIDES = {
    "รังสีวินิจฉัย": {
        328: "ข",
        357: "ค",
        395: "ข",
        514: "ค",
    },
    "กฎหมาย": {
        130: "ค",
        140: "ง",
        144: "จ",
        175: "ข",
        217: "ก",
        221: "ข",
        281: "ก",
        283: "ค",
        294: "ก",
        301: "ง",
    },
    "เวชศาสตร์นิวเคลียร์": {
        264: "ข",
    },
    "การดูเเลผู้ป่วย": {
        399: "ข",
        410: "ก",
        443: "ก",
        493: "จ",
        632: "ก",
    },
}

MANUAL_QUESTION_PATCHES = {
    "การดูเเลผู้ป่วย": {
        632: {
            "choices": {
                "ก": "Annihilation",
                "ข": "Compton effect",
                "ค": "Coherent scattering",
                "ง": "Photodisintegrations",
                "จ": "Photoelectric effect",
            },
        },
    },
}

def apply_manual_answer_overrides(pdf_path, answers):
    filename = Path(pdf_path).name
    for keyword, overrides in MANUAL_ANSWER_OVERRIDES.items():
        if keyword in filename:
            answers.update(overrides)
    return answers

def apply_manual_question_patches(pdf_path, questions):
    filename = Path(pdf_path).name
    for keyword, patches in MANUAL_QUESTION_PATCHES.items():
        if keyword not in filename:
            continue

        for question in questions:
            patch = patches.get(question["id"])
            if patch:
                question.update(patch)

    return questions

def fix_thai_chars(text):
    if not text:
        return ""
        
    mapping = {
        'ÿ': 'ส',
        'ü': 'ว',
        'Ā': 'ห',
        'ý': 'ศ',
        'þ': 'ษ',
        'Ă': 'อ',
        'É': '่',
        'Ê': '้',
        'Í': '์',
        'ā': 'ฬ',
        'ﬀ': 'ff',
        '◌': '',
        'ขอ': 'ข้อ',
        'ใĀ': 'ให้',
        'คüร': 'ควร',
        chr(0xF700): '่', chr(0xF701): '้', chr(0xF702): '๊', chr(0xF703): '๋', chr(0xF704): '์',
        chr(0xF705): '่', chr(0xF706): '้', chr(0xF707): '๊', chr(0xF708): '๋', chr(0xF709): '์',
        chr(0xF70A): '่', chr(0xF70B): '้', chr(0xF70C): '๊', chr(0xF70D): '๋', chr(0xF70E): '์',
        chr(0xF70F): 'ํ', chr(0xF710): 'ั', chr(0xF711): 'ิ', chr(0xF712): '็', chr(0xF713): '็',
        chr(0xF714): '์', chr(0xF71B): '', chr(0xFB01): 'fi', chr(0xFB02): 'fl',
    }
    for k, v in mapping.items():
        text = text.replace(k, v)
        
    # Fix common Thai character patterns
    text = re.sub(r'([ก-ฮ])\s+า', r'\1ำ', text)
    
    return text

def parse_pdf(pdf_path):
    star_answers = apply_manual_answer_overrides(pdf_path, extract_star_answers(pdf_path))
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        try:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"
        except:
            continue

    full_text = fix_thai_chars(full_text)
    
    # Fix specific OCR artifacts
    full_text = full_text.replace("220.ข้อใด", "\n220. ข้อใด")
    full_text = full_text.replace("C1,C2295.", "C1,C2\n295. ")
    full_text = full_text.replace("0358.", "\n358. ")
    full_text = full_text.replace("26-26623.", "26-26\n623. ")
    full_text = full_text.replace("แ5633.", "แ5\n633. ")
    full_text = full_text.replace("C2636.", "C2\n636. ")
    
    # First, split the full text into question chunks
    chunks = re.findall(r'(?<!\d)(\d+)\.\s+(.*?)(?=(?<!\d)\d+\.\s+|$)', full_text, re.DOTALL)
    
    questions = []
    for q_num_str, q_text in chunks:
        q_id = int(q_num_str)
        
        # Extract the question and the choices from q_text
        # Use a more robust regex to capture everything after the last choice as trailing text
        match = re.search(r'(.*?)(?=ก\.)ก\.(.*?)(?=ข\.)ข\.(.*?)(?=ค\.)ค\.(.*?)(?=ง\.)ง\.(.*?)(?:(?=จ\.)จ\.(.*))?$', q_text, re.DOTALL)
        
        explanation = ""
        answer = ""
        
        if match:
            question_text = match.group(1).strip()
            choices = {
                "ก": match.group(2).strip(),
                "ข": match.group(3).strip(),
                "ค": match.group(4).strip(),
                "ง": match.group(5).strip()
            }
            
            last_choice_key = "ง"
            last_choice_text = match.group(5).strip()
            
            if match.group(6):
                choices["จ"] = match.group(6).strip()
                last_choice_key = "จ"
                last_choice_text = match.group(6).strip()
            
            # Check if the last choice has a newline, which often indicates an explanation follows
            if "\n" in last_choice_text:
                parts = last_choice_text.split("\n", 1)
                choices[last_choice_key] = parts[0].strip()
                explanation = parts[1].strip()
        else:
            numeric_match = re.search(r'(.*?)(?=1\.)1\.(.*?)(?=2\.)2\.(.*?)(?=3\.)3\.(.*?)(?=4\.)4\.(.*?)(?:(?=5\.)5\.(.*))?$', q_text, re.DOTALL)
            if numeric_match:
                question_text = numeric_match.group(1).strip()
                choices = {
                    "ก": numeric_match.group(2).strip(),
                    "ข": numeric_match.group(3).strip(),
                    "ค": numeric_match.group(4).strip(),
                    "ง": numeric_match.group(5).strip()
                }
                if numeric_match.group(6):
                    choices["จ"] = numeric_match.group(6).strip()
            else:
                # Fallback if no choices found
                question_text = q_text.strip()
                choices = {}
                
        questions.append({
            "id": q_id,
            "question": question_text,
            "choices": choices,
            "explanation": explanation,
            "answer": star_answers.get(q_id, answer)
        })
    
    return apply_manual_question_patches(pdf_path, questions)

EXAM_SOURCES = {
    "exam_2566_anatomy.json": "กายวิภาค",
    "exam_2566_diagnostic.json": "รังสีวินิจฉัย",
    "exam_2566_nuclear.json": "เวชศาสตร์นิวเคลียร์",
    "exam_2566_radiation.json": "รังสีรักษา",
    "exam_2566_law.json": "กฎหมาย",
    "exam_2566_patient_care.json": "การดูเเลผู้ป่วย",
}

def find_pdf_by_keyword(keyword):
    for path in Path("Exam_File").glob("*.pdf*"):
        if keyword in path.name:
            return path
    raise FileNotFoundError(f"No PDF in Exam_File matching {keyword!r}")

def build_all_json():
    output_dir = Path("public")
    output_dir.mkdir(exist_ok=True)
    for output_name, keyword in EXAM_SOURCES.items():
        pdf_path = find_pdf_by_keyword(keyword)
        questions = parse_pdf(pdf_path)
        out_path = output_dir / output_name
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print(f"{out_path}: extracted {len(questions)} questions from {pdf_path.name}")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    if len(sys.argv) == 2 and sys.argv[1] == "--all":
        build_all_json()
        raise SystemExit(0)

    # Support command line args for flexibility
    if len(sys.argv) > 2:
        pdf_path = sys.argv[1]
        out_path = sys.argv[2]
    else:
        pdf_path = "Exam_File/✅2566 เวชศาสตร์นิวเคลียร์  - เฉลย.pdf"
        out_path = "public/exam_2566_nuclear.json"
        
    questions = parse_pdf(pdf_path)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(questions)} questions")
