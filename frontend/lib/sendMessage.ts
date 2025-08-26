import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "../components/ChatArea/ChatArea";
import { formatMessage } from "../utils/formatMessage";

let isFirstUserMessageSet = false;
let isFirstAssistantMessageSet = false;

const saveMessage = async (message: MessageItem, conversationKey: string) => {
  const response = await fetch(`/api/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationKey,
      sender: message.sender,
      content: message.content,
      message: {
        key: message.key,
        conversationKey,
        text: message.text,
        sender: message.sender,
        content: message.content,
        date: message.date,
        rating: message.rating,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save ${message.sender} message`);
  }

  return response.json();
};

const updateConversation = async (
  conversationKey: string,
  userId: string,
  updates: any
) => {
  const response = await fetch(
    `/api/chat/conversations?user_id=${userId}&key=${conversationKey}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update conversation");
  }

  return response.json();
};

const createConversation = async (userId: string, title: string) => {
  const response = await fetch(`/api/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: uuidv4(),
      title: "Conversation",
      desc: "New conversation",
      date: new Date().toISOString(),
      isSelected: true,
      isPinned: false,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  return response.json();
};

export const sendMessage = async (
  text: string,
  conversationKey: string,
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>,
  setConversations: React.Dispatch<React.SetStateAction<any[]>>
  setLoading
) => {
  if (!text.trim()) {
    console.error("message content is empty");
    return;
  }

  try {
    setLoading?.(true)
    let currentConversationKey = conversationKey;

    if (!currentConversationKey) {
      const newConversation = await createConversation(
        userId,
        text.substring(0, 20)
      );
      currentConversationKey = newConversation.key;
      setConversations((prev) => [...prev, newConversation]);
      return currentConversationKey;
    }

    const formattedText = formatMessage(text.trim());
    const userMessage: MessageItem = {
      key: uuidv4(),
      conversationKey: currentConversationKey,
      text: formattedText,
      isUser: true,
      content: formattedText,
      images: [],
      timestamp: new Date().toISOString(),
      sender: "user",
      date: new Date().toISOString(),
      rating: "good",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const savedUserMessage = await saveMessage(
      userMessage,
      currentConversationKey
    );
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.key === userMessage.key
          ? { ...msg, key: savedUserMessage.newMessage.key }
          : msg
      )
    );

    if (!isFirstUserMessageSet) {
      await updateConversation(currentConversationKey, userId, {
        title: userMessage.text.substring(0, 20),
      });
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === currentConversationKey
            ? { ...conversation, title: userMessage.text.substring(0, 20) }
            : conversation
        )
      );
      isFirstUserMessageSet = true;
    }

    const assistantResponse = await fetch(`/api/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text.trim() }),
    });

    if (!assistantResponse.ok) {
      throw new Error("Failed to get assistant response");
    }

    const assistantData = await assistantResponse.json();
    if (!assistantData || !assistantData.answer) {
      throw new Error("Invalid assistant response format");
    }

    const formattedResponse = formatMessage(assistantData.answer);

    const assistantMessage: MessageItem = {
      key: uuidv4(),
      conversationKey: currentConversationKey,
      text: formattedResponse,
      isUser: false,
      images: [],
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      content: formattedResponse,
      sender: "assistant",
      rating: "good",
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    const savedAssistantMessage = await saveMessage(
      assistantMessage,
      currentConversationKey
    );
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.key === assistantMessage.key
          ? { ...msg, key: savedAssistantMessage.newMessage.key }
          : msg
      )
    );

    if (!isFirstAssistantMessageSet) {
      await updateConversation(currentConversationKey, userId, {
        desc: assistantMessage.text.substring(0, 30),
      });
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.key === currentConversationKey
            ? { ...conversation, desc: assistantMessage.text.substring(0, 30) }
            : conversation
        )
      );
      isFirstAssistantMessageSet = true;
    }

    if (assistantMessage.rating === "bad") {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.key !== assistantMessage.key)
      );

      await fetch(`/api/chat/badResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantMessage }),
      });
    }

    return currentConversationKey;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  } finally {
    setLoading?.(false)
  }
};
