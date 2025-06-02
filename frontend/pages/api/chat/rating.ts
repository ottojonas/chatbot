import { NextApiRequest, NextApiResponse } from 'next'
import connect_to_database from '../../../lib/mongoose_connection'
import Messages from '../../../models/Messages'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect_to_database() 

    if (req.method === "POST") {
        const {key, rating} = req.body; 

        if (!key || !rating) {
            return res.status(400).json({ error: "Both key and rating are required to rate api" })
        }

        try {
            console.log("Recieved request body: ", req.body); 
            console.log("Recieved key: ", key); 
            
            const message = await Messages.findOne({ key })
            
            if (!message) {
                console.log("Message not found with key: ", key)
                return res.status(404).json({ error: "Could not find message" })
            }

            message.rating = rating; 
            await message.save() 

            res.status(200).json({ message: "Message rated successfully" })
        } catch (error) {
            console.error("Error rating message: ", error)
            return res.status(500).json({ error: "Failed to rate message" })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} not allowed`)
    }
}
