import { NextApiRequest, NextApiResponse } from "next";
import Conversation, { IConversation } from "../../../models/Conversations";
import connect_to_database from "../../../lib/mongoose_connection";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// ----------------------------------------------------------------------------------------------------------------------
// TODO
// - PUT method not working
// ERROR
// - `find` and `findOneAndUpdate` methods not callable but working none the less ? no problemo
// ----------------------------------------------------------------------------------------------------------------------

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect_to_database();

  const { key } = req.query;

  if (req.method === "POST") {
    try {
      const { title, desc, date, isSelected, isPinned, user_id } = req.body;
      const key = uuidv4();
      if (
        !key ||
        !title ||
        !desc ||
        !user_id ||
        isSelected === undefined ||
        isPinned === undefined
      ) {
        return res.status(400).json({ error: "Missing required field" });
      }
      const newConversation = new Conversation({
        key,
        title,
        desc,
        date,
        isSelected,
        isPinned,
        user_id,
      });
      await newConversation.save();
      res.status(201).json({ message: "POST request successful", key });
    } catch (error) {
      console.error(`Error saving conversation\n${error}`);
      res.status(500).json({ error: "Failed to save conversation" });
    }
  } else if (req.method === "GET") {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({
          error: "user_id is required for fetching users conversations",
        });
      }
      const objectId = new mongoose.Types.ObjectId(user_id as string);
      const conversations = await Conversation.find({
        user_id: objectId,
      }).exec();
      return res.status(200).json(conversations);
    } catch (error) {
      console.error(`Error fetching conversations: ${error}`);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res
          .status(400)
          .json({ error: "user_id is required for deleting conversations" });
      }
      await Conversation.deleteMany({ user_id });
      res.status(200).json({ message: "User conversations have been deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conversations" });
      console.error(`Error deleting conversations: ${error}`);
    }
  } else if (req.method === "PUT") {
    try {
      const { key, user_id } = req.query;
      const { isPinned, title, desc } = req.body;
      if (!user_id) {
        return res
          .status(400)
          .json({ error: "Cannot modify the conversation without user_id" });
      }
      const updatedData: any = {};
      if (isPinned !== undefined) updatedData.isPinned = isPinned;
      if (title !== undefined) updatedData.title = title;
      if (desc !== undefined) updatedData.desc = desc;

      const updatedConversation = await Conversation.findOneAndUpdate(
        { key, user_id },
        updatedData,
        { new: true }
      );

      if (!updatedConversation) {
        return res.status(404).json({ error: "Could not find conversation" });
      }

      res.status(200).json(updatedConversation);
    } catch (error) {
      console.error("Error updating conversation:", error);
      return res
        .status(500)
        .json({ error: "Failed to update the conversation" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} is not a valid method`);
  }
}
