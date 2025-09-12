// import fs from "fs";
// import path from "path";
// import mongoose from "mongoose";
// import TrainingDocument from "./TrainingDocuments";
// import dotenv from "dotenv";

// dotenv.config();

// const MONGODB_URI = process.env.MONGODB_URI;
// const inputDir = path.join(process.cwd(), "..", "json_pdf");

// async function main() {
//   await mongoose.connect(MONGODB_URI);
//   const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".json"));
//   for (const file of files) {
//     const docData = JSON.parse(
//       fs.readFileSync(path.join(inputDir, file), "utf-8")
//     );
//     if (Array.isArray(docData)) {
//       await TrainingDocument.create(docData);
//     } else {
//       await TrainingDocument.create(docData);
//     }
//     console.log(`Training document uploaded: ${file}`);
//   }
//   await mongoose.disconnect();
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
