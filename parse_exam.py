import PyPDF2
import json
import re

def fix_thai_chars(text):
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
        
    # Fix the separated สระอำ (e.g. "ท า" -> "ทำ")
    text = re.sub(r'([ก-ฮ])\s+า', r'\1ำ', text)
    
    return text

def parse_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    
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
        match = re.search(r'(.*?)(?=ก\.)ก\.(.*?)(?=ข\.)ข\.(.*?)(?=ค\.)ค\.(.*?)(?=ง\.)ง\.(.*?)(?:(?=จ\.)จ\.(.*?))?$', q_text, re.DOTALL)
        if match:
            question_text = match.group(1).strip()
            choices = {
                "ก": match.group(2).strip(),
                "ข": match.group(3).strip(),
                "ค": match.group(4).strip(),
                "ง": match.group(5).strip()
            }
            if match.group(6):
                choices["จ"] = match.group(6).strip()
        else:
            # Fallback if no choices found
            question_text = q_text.strip()
            choices = {}
                
        questions.append({
            "id": q_id,
            "question": question_text,
            "choices": choices,
            "explanation": "",
            "answer": ""
        })
    
    return questions

if __name__ == "__main__":
    import sys
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
