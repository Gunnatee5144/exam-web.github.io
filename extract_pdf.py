import PyPDF2
import json
import sys

def extract_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for i in range(min(5, len(reader.pages))):
            text += reader.pages[i].extract_text() + '\n'
        return text

if __name__ == '__main__':
    text = extract_text(sys.argv[1])
    print(text[:3000])
