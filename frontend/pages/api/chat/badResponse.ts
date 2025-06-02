import { NextApiRequest, NextApiResponse } from 'next'
import connect_to_database from '../../../lib/mongoose_connection'
import BadResponse from '../../../models/BadResponse'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect_to_database() 

    if (req.method === "POST") {
        const {key, conversationKey, text, isUser, content, images, timestamp, sender, date, rating} = req.body;
        if (!key || !conversationKey || !content || !timestamp || !sender || !rating) {
            return res.status(400).json({ error: "Missing required fields for Bad Response" })
        }
        try {
            const newBadResponse = new BadResponse({
                key, conversationKey, text, isUser, content, images, timestamp, sender, date, rating, 
            }); 
            await newBadResponse.save() 
            res.status(200).json(newBadResponse)
        } catch (error) {
            console.error("Error saving bad response: ", error)
            res.status(500).json({ error: "Failed to save bad response" })
        }
    }
    else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} not allowed, only POST method available`)
    }
}
