import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import TrainingDocument from "./TrainingDocuments";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const inputDir = path.join(process.cwd(), "..", "updated_training_docs_txt");

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }
  await mongoose.connect(MONGODB_URI);
  function walkDir(dir: string, callback: (filePath: string) => void) {
    fs.readdirSync(dir).forEach((f) => {
      const dirPath = path.join(dir, f);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        walkDir(dirPath, callback);
      } else if (f.endsWith(".txt")) {
        callback(path.join(dir, f));
      }
    });
  }
  const uploads: Promise<any>[] = [];
  walkDir(inputDir, (filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const key = path.relative(inputDir, filePath).replace(/\\/g, "/");
    const title = path.basename(filePath, ".txt");
    uploads.push(
      (TrainingDocument as any).findOneAndUpdate(
        { key },
        { key, title, content },
        { upsert: true, new: true }
      )
    );
    console.log(`Queued: ${key}`);
  });
  await Promise.all(uploads);
  console.log("All documents uploaded");
  mongoose.disconnect();
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
