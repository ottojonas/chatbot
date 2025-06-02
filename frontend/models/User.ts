import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
    email: string; 
    password: string; 
    secretKey: string; 
    admin: boolean; 
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true, 
        unique: false
    },
    secretKey: {
        type: String, 
        required: true, 
        unique: true
    }, 
    admin: {
        type: Boolean, 
        required: true, 
        default: false
    }
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema); 

export default User
