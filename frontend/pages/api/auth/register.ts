import { NextApiRequest, NextApiResponse } from 'next' 
import connect_to_database from '../../../lib/mongoose_connection'
import User from '../../../models/User'
import argon2 from 'argon2'
import crypto from 'crypto'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {email, password} = req.body; 

        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" }) 
        }
        await connect_to_database()

        const existingUser = await User.findOne({ email }) 
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" }) 
        }

        const hashedPassword = await argon2.hash(password)
        const secretKey = crypto.randomBytes(64).toString("hex")
        const user = new User({ email, password: hashedPassword, secretKey})
        await user.save()

        return res.status(201).json({ message: "User has been successfully registered" })
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} is not allowed`)
    }
}
