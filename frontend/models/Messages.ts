import mongoose, {Document, Schema} from 'mongoose'
import Conversation from './Conversations'

export interface IMessage extends Document {
    key: string; 
    conversationKey: string;  
    sender: string; 
    content: string; 
    timestamp: Date;
    images: string; 
    rating: string; 
}

const MessageSchema: Schema = new mongoose.Schema({
    key: {
        type: String, 
        required: true, 
        unique: true, 
    }, 
    conversationKey: {
        type: String, 
        ref: "Conversation", 
        required: true, 
    }, 
    sender: {
        type: String, 
        required: true, 
    }, 
    content: {
        type: String, 
        required: true, 
    }, 
    timestamp: {
        type: Date,
        default: Date.now, 
    }, 
    images: {
        type: String, 
        required: false, 
    }, 
    rating: {
        type: String, 
        enum: ["good", "bad"], 
        default: "good", 
    }
})

MessageSchema.virtual("conversation", {
    ref: "Conversation", 
    localField: "conversationKey", 
    foreignField: "key", 
    justOne: true, 
})

const Messages = mongoose.models.Messages || mongoose.model<IMessage>("Messages", MessageSchema)

export default Messages