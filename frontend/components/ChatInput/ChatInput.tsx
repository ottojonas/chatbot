import React from 'react'
import Refresh from '../icons/Refresh'
import Mic from '../icons/Mic'
import Send from '../icons/Send'
import { formatMessage } from '../../utils/formatMessage'

type MessageItem = {
    key: string; 
    conversationKey: string; 
    isUser: boolean; 
    sender: string; 
    text: string; 
    images: { key: number; url: string }[]; 
    timestamp: string; 
    date: string; 
    content: string; 
    rating: string; 
}

interface Props {
    sendMessage: (message: string) => void; 
    inputValue: string; 
    setInputValue: (value: string) => void; 
    messages: MessageItem[]
    setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>
    conversationKey: string
}

const ChatInput:React.FC<Props> = ({
    sendMessage, inputValue, messages, setMessages, setInputValue, conversationKey
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); 
            handleSendMessage() 
        }
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim()) {
            console.error("Message content is empty") 
            return; 
        }
        sendMessage(inputValue.trim())
        setInputValue("")
    }

    return (
        <div className="fixed inset-x-0 bottom-0 pt-8 bg-input">
            <div style={{marginLeft: "384px", marginRight: "320px"}}>
                <div className="max-w-3xl px-4 pb-3 mx-auto">
                    <div className="flex justify-center py-2">
                        <button className="py.2 px-6  rounded-md bg-card flex items-center">
                            <Refresh className="w-5 h-5" />
                            <span className="ml-2">Regenerate Response</span>
                        </button>
                    </div>
                    <div className="relative rounded-md bg-card">
                        <textarea 
                            rows={2} 
                            className="w-full px-4 py-2 rounded-md resize-none bg-card" 
                            placeholder="Enter your query..."
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="absolute flex items-center space-x-3" style={{ right: "16px", top: "50%", transform:"translate(0, -50%)"}}>
                            <button className="grid w-10 h-10 text-white rounded-md place-items-center">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button className="grid w-10 h-10 text-white rounded-md place-items-center bg-brandWhite" onClick={handleSendMessage}>
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInput; 
