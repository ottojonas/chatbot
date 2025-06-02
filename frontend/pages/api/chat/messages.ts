import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '../../../lib/mongoose_connection'
import Messages, {IMessage} from '../../../models/Messages'
import Conversation from '../../../models/Conversations'
import {v4 as uuidv4} from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase(); 

        if (req.method === "GET") {
            const { conversationKey } = req.query; 
            if (!conversationKey) {
                return res.status(400).json({ error: "Conversation Key is required for fetching messages" })
            }
            try {
                const messages = await Messages.find<IMessage>({
                    conversationKey 
                }).exec() 
                return res.status(200).json(messages)
            } catch (error) {
                console.error("Error loading messages:", error)
                return res.status(500).json({ error: "Failed to load messages" })
            }
        }
        else if (req.method === "POST") {
            const {message, conversationKey, sender, content} = req.body; 
            try {
                const conversation = await Conversation.findOne({ key: conversationKey })
                if (!conversation) {
                    return res.status(404).json({ error: "Could not find conversation" })
                }

                const newMessage = new Messages({
                    key: uuidv4(), 
                    conversationKey, 
                    sender: message.sender, 
                    content: message.content, 
                    timestamp: new Date(), 
                })

                await newMessage.save()
                return res.status(201).json({ newMessage })
            } catch (error) {
                console.error("Error saving message:", error)
                return res.status(500).json({ error: "Failed to save message" })
            }
        } 
        else if (req.method === "DELETE") {
            const { conversationKey } = req.query; 
            if (!conversationKey) {
                return res.status(400).json({ error: "Conversation Key is required to delete messages" })
            }
            try {
                await Messages.deleteMany({ conversationKey })
                return res.status(200).json({ message: "Messages have been successfully deleted" })
            } catch (error) {
                console.error("Error deleting messages:", error)
                return res.status(500).json({ error: "Failed to delete messages" })
            }
        } 
        else {
            res.setHeader("Allow", ["GET", "POST", "DELETE"])
            return res.status(405).json({ error: `Method ${req.method} not allowed` })
        }
    } catch (error) {
        console.error("Server error:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}
