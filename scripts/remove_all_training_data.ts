// import mongoose from 'mongoose'; 
// import TrainingDocument from './TrainingDocuments';
// import dotenv from 'dotenv';

// dotenv.config(); 

// const MONGODB_URI = process.env.MONGODB_URI || '';

// async function main() {
//     await mongoose.connect(MONGODB_URI);
//     console.log("Connected to database");
//     const result = await TrainingDocument.deleteMany({}); 
//     console.log(`Deleted ${result.deletedCount} documents from Training Documents`); 
//     await mongoose.disconnect(); 
// }

// main().catch((err) => {
//     console.error(err); 
//     process.exit(1); 
// })