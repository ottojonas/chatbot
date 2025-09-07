import fitz
import os
import json
from icecream import ic

pdf_dir = "../updated_training_docs_pdf"
output_dir = "../extracted_images"
json_output_dir = "../json_pdf"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(json_output_dir, exist_ok=True)
for filename in os.listdir(pdf_dir):
    if filename.lower().endswith(".pdf"):
        pdf_path = os.path.join(pdf_dir, filename)
        doc = fitz.open(pdf_path)
        all_text = []
        all_images = []

        for page_index in range(len(doc)):
            page = doc[page_index]
            all_text.append(page.get_text())
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                if pix.n < 5:
                    img_filename = f"{os.path.splitext(filename)[0]}_page{page_index+1}_img{img_index+1}.png"
                    img_path = os.path.join(output_dir, img_filename)
                    pix.save(img_path)
                    all_images.append(img_path)
                pix = None

        training_doc = {
            "key": os.path.splitext(filename)[0],
            "title": os.path.splitext(filename)[0],
            "content": "\n".join(all_text),
            "images": all_images,
        }

        json_path = os.path.join(
            json_output_dir, f"{os.path.splitext(filename)[0]}.json"
        )
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(training_doc, f, indent=2)

        ic(f"Extracted text and images to {json_path}")
