from pathlib import Path
import unittest

from parse_exam import parse_pdf


def find_exam_file(keyword: str) -> Path:
    return next(path for path in Path("Exam_File").glob("*.pdf*") if keyword in path.name)


class ParseExamTests(unittest.TestCase):
    def test_anatomy_explanation_comes_from_source_pdf(self):
        questions = parse_pdf(find_exam_file("กายวิภาค"))

        first = questions[0]

        self.assertEqual(first["id"], 1)
        self.assertTrue(first["question"].startswith("เส้นสมมติที่ลากจากรูหูถึงหางตา"))
        self.assertTrue(first["choices"]["ก"].startswith("Obitomeatalbase line"))
        self.assertEqual(first["explanation"], "Outer canthus - EAM")
        self.assertEqual(first["answer"], "ก")

    def test_nuclear_answer_comes_from_star_marker(self):
        questions = parse_pdf(find_exam_file("เวชศาสตร์"))

        first = questions[0]

        self.assertEqual(first["id"], 1)
        self.assertTrue(first["question"].startswith("นิวไคล์ที่เป็น isomer กัน"))
        self.assertTrue(first["choices"]["จ"].startswith("เป็นนิวไคล์เดียวกัน"))
        self.assertEqual(first["answer"], "จ")

    def test_nuclear_answer_comes_from_choice_highlight_when_star_is_missing(self):
        questions = parse_pdf(find_exam_file("เวชศาสตร์"))

        question = next(q for q in questions if q["id"] == 301)

        self.assertTrue(question["question"].startswith("Half life ของ I-125"))
        self.assertEqual(question["answer"], "จ")
        self.assertIn("1,400", question["choices"]["จ"])

    def test_anatomy_answer_is_inferred_when_star_covers_choice_label(self):
        questions = parse_pdf(find_exam_file("กายวิภาค"))

        question = next(q for q in questions if q["id"] == 228)

        self.assertIn("iliopectineal line", question["question"])
        self.assertEqual(question["answer"], "ก")
        self.assertEqual(question["choices"]["ก"], "L1")

    def test_diagnostic_answer_comes_from_vector_star_marker(self):
        questions = parse_pdf(find_exam_file("รังสีวินิจฉัย"))

        question = next(q for q in questions if q["id"] == 328)

        self.assertIn("Contrast", question["question"])
        self.assertEqual(question["answer"], "ข")
        self.assertIn("Epidural", question["choices"]["ข"])

    def test_numeric_choices_are_mapped_to_thai_choice_keys(self):
        questions = parse_pdf(find_exam_file("การดูเเลผู้ป่วย"))

        question = next(q for q in questions if q["id"] == 632)

        self.assertEqual(question["answer"], "ก")
        self.assertEqual(question["choices"]["ก"], "Annihilation")


if __name__ == "__main__":
    unittest.main()
