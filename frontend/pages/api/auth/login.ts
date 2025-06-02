import type {NextApiRequest, NextApiResponse } from 'next'
import connect_to_database from '../../../lib/mongoose_connection'
import User from '../../../models/User'
import argon2 from 'argon2'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: "Email and Password are required"})
        }

        await connect_to_database(); 

        const user = await User.findOne({ email })
        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(401).json({ error: "Invalid email or password" })
        }

        const userSecretKey = crypto.randomBytes(64).toString("hex")
        user.secretKey = userSecretKey; 
        await user.save() 

        const token = jwt.sign({ id: user._id, admin: user.admin}, userSecretKey, {
            expiresIn: "1hr"
        }); 

        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`)

        console.log("Set-Cookie Header: ", `token=${token}; HttpOnly; Path=/; Max-Age=3600`)

        return res.status(200).json({ message: "User signed in successfully", token, userId: user._id, admin: user.admin})
    }
    else {
        res.setHeader('Allow', ['POST']); 
        res.status(405).end(`Method ${req.method} is not allowed`)
    }
}
