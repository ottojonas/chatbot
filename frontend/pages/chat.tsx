import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import CustomHead from "../components/common/CustomHead";
import Info from "../components/Info/Info";
import ChatArea from "../components/ChatArea/ChatArea";
import ChatInput from "../components/ChatInput/ChatInput";
import ChatHistory from "../components/ChatHistory/ChatHistory";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import { MessageItem } from "../components/ChatArea/ChatArea";
import { sendMessage } from "../lib/sendMessage";
import { useRouter } from "next/router";

const Chat = () => {
  const [conversationKey, setConversationKey] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `/api/chat/conversations?user_id=${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationKey) {
        setMessages([]);
        return;
      }
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
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages: ", error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [conversationKey]);

  if (!userId) return null;

  return (
    <>
      {/* <CustomHead title="Chat bot" /> */}
      <ChatHeader />
      <Sidebar />
      <ChatHistory
        conversations={conversations}
        setConversationKey={setConversationKey}
        setConversations={setConversations}
      />
      <ChatArea
        messages={messages}
        setMessages={setMessages}
        conversationKey={conversationKey}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            userId,
            setMessages,
            setConversations,
            setLoading
          )
        }
        setConversationKey={setConversationKey}
      />
      <ChatInput
        setMessages={setMessages}
        sendMessage={(text) =>
          sendMessage(
            text,
            conversationKey,
            userId,
            setMessages,
            setConversations,
            setLoading
          )
        }
        inputValue={inputValue}
        setInputValue={setInputValue}
        messages={messages}
        conversationKey={conversationKey}
      />
      <Info />
    </>
  );
};

export default Chat;
