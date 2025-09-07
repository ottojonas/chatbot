import "openai/shims/node";
import { NextApiRequest, NextApiResponse } from "next";
import connect_to_database from "../../../lib/mongoose_connection";
import { OpenAI } from "openai";
import TrainingDocument, {
  ITrainingDocument,
} from "../../../models/TrainingDocuments";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY_KEY,
  dangerouslyAllowBrowser: true, // to allow or to not allow the browser ? that is the question
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect_to_database();

    if (req.method === "POST") {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: "No question provided" });
      }

      try {
        const documents: ITrainingDocument[] = await (TrainingDocument as any)
          .find({})
          .lean()
          .exec();

        const filteredDocuments = documents.map((doc) => ({
          key: doc.key,
          title: doc.title,
          content: doc.content,
          images: doc.images || [],
        }));

        const relevantDocs = filteredDocuments.filter((doc) =>
          doc.content.includes(question)
        );
        const images = relevantDocs.flatMap((doc) => doc.images || []);

        let documentTexts = filteredDocuments
          .map((doc) => doc.content)
          .join("\n\n");

        const maxLength = 1000000;
        if (documents.length > maxLength) {
          documentTexts = documentTexts.substring(0, maxLength);
        }

        const prompt = `Your name is PeacockGPT and you are an understanding and respectful employee who is helping train or assist employees to use the internal systems. Using the documentation in: \n\n${documentTexts}, answer the following question: ${question}\nAnswer in clear and concise bullet points`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        });

        const answer = response?.choices?.[0]?.message?.content?.trim();
        res.status(200).json({ answer, images });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error generating response: ", error.message);
          console.error("Stack Trace: ", error.stack);
          res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
        } else {
          console.error("I dont know what went wrong lol :) ");
          res
            .status(500)
            .json({ error: "Some sort of error i dont know :/ good luck" });
        }
      }
    } else {
      res.status(405).json({ error: "api method not valid" });
    }
  } catch (error) {
    console.error("error connecting to database or importing model: ", error);
    res
      .status(500)
      .json({ message: "Internal server error: ", error: String(error) });
  }
}
