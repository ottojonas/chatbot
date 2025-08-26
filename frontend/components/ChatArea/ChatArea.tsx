import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "../ChatInput/ChatInput";
import ChatItem from "./ChatItem/ChatItem";
import { sendMessage as sendMsg } from "../../lib/sendMessage";
import { formatMessage } from "../../utils/formatMessage";

export type MessageItem = {
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
};

interface ChatProps {
  messages: MessageItem[];
  loading: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  conversationKey: string;
  sendMessage: (text: string) => Promise<string | void>;
  setConversationKey: (key: string) => void;
}

const ChatArea: React.FC<ChatProps> = ({
  messages,
  setMessages,
  conversationKey,
  sendMessage,
  setConversationKey,
  loading,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = async (text: string) => {
    const newConversationKey = await sendMessage(text);
    if (newConversationKey) {
      setConversationKey(newConversationKey);
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/chat/messages?conversationKey=${conversationKey}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const messageData = await response.json();
        setMessages(messageData);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    if (conversationKey) {
      fetchMessages();
    }
  }, [conversationKey, setMessages]);

  const handleThumbsDown = async (message: MessageItem) => {
    setLoading(true);
    try {
      // First, mark the message as bad
      const badResponse = await fetch(`/api/chat/badResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: message.key,
          conversationKey: message.conversationKey,
          text: message.text,
          isUser: message.isUser,
          content: message.content,
          images: message.images,
          timestamp: message.timestamp,
          sender: message.sender,
          date: message.date,
          rating: "bad",
        }),
      });

      if (!badResponse.ok) {
        throw new Error("Failed to mark response as bad");
      }

      // Remove the bad message from the UI
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.key !== message.key)
      );

      // Get a new response
      const newResponse = await fetch(`/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: message.text,
          conversationKey: message.conversationKey,
        }),
      });

      if (!newResponse.ok) {
        throw new Error("Failed to get new response");
      }

      const data = await newResponse.json();
      if (!data || !data.answer) {
        throw new Error("Invalid response format");
      }

      // Create and add the new message
      const newMessage: MessageItem = {
        key: uuidv4(),
        conversationKey: message.conversationKey,
        text: formatMessage(data.answer),
        isUser: false,
        images: [],
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        content: formatMessage(data.answer),
        sender: "assistant",
        rating: "good",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Save the new message
      await fetch(`/api/chat/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationKey: message.conversationKey,
          sender: "assistant",
          content: newMessage.content,
          message: {
            key: newMessage.key,
            conversationKey: message.conversationKey,
            text: newMessage.text,
            sender: newMessage.sender,
            content: newMessage.content,
            date: newMessage.date,
            rating: newMessage.rating,
          },
        }),
      });
    } catch (error) {
      console.error("Error regenerating response:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="chat-container"
      style={{ marginLeft: "384px", marginRight: "320px" }}
    >
      {loading && (
        <div className="flex items-center justify-center py-4">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}
      <div className="px-4 pt-16 pb-48 mx-auto max-w-3x1 chat-messages">
        {Array.isArray(messages) &&
          messages
            .filter(Boolean)
            .map((item) => (
              <ChatItem
                item={item}
                key={item.key}
                onThumbsDown={handleThumbsDown}
              />
            ))}
      </div>
      <ChatInput
        setMessages={setMessages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
        sendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatArea;
