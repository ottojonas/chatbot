import os
from docx import Document

input_dir = "updated_training_docs"
output_dir = "updated_training_docs_txt"

os.makedirs(output_dir, exist_ok=True)

for root, dir, files in os.walk(input_dir):
    for filename in files:
        if filename.endswith(".docx"):
            docx_path = os.path.join(root, filename)
            rel_dir = os.path.relpath(root, filename)
            out_subdir = os.path.join(output_dir, rel_dir)
            os.makedirs(out_subdir, exist_ok=True)
            txt_path = os.path.join(out_subdir, filename.replace(".docx", ".txt"))
            doc = Document(docx_path)
            text = "\n".join([para.text for para in doc.paragraphs])
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(text)
