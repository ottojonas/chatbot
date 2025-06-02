// external
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// context
import { useAuth } from "../../context/AuthContext";

// icons
import Options from "../icons/Options";
import PencilSquareIcon from "../icons/PencilSquareIcon";
import PinnedIcon from "../icons/PinnedIcon";
import ListAllIcon from "../icons/ListAllIcon";
import Times from "../icons/Times";
import SearchIcon from "../icons/SearchIcon";

// ----------------------------------------------------------------------------------------------------------------------
//  TODO
// - Title updates
// - Description updates
//! TOFIX
// - State management of conversations
//  - Selection of multiple / all conversations until page reloaded
//  - Pinning them does not work | // ! 404 error
// ----------------------------------------------------------------------------------------------------------------------

type ConversationProps = {
  key: string;
  title: string;
  desc: string;
  date: string;
  isSelected: boolean;
  isPinned: boolean;
  user_id: string;
};

const createNewConversation = (userId: string): ConversationProps => {
  const now = new Date();
  return {
    key: uuidv4(),
    title: "New Conversation",
    desc: "New Conversation",
    date: now.toISOString(),
    isSelected: true,
    isPinned: false,
    user_id: userId,
  };
};

type Props = {
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
  conversations: any[];
  setConversationKey: (key: string) => void;
};

const ChatHistory: React.FC<Props> = ({
  setConversations,
  conversations = [],
  setConversationKey,
}) => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationProps | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      console.log("Fetching conversations for user");
      const response = await fetch(
        `/api/chat/conversations?user_id=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch conversations: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      const formattedConversations = data.map((conversation: any) => {
        const date = new Date(conversation.date);
        return {
          ...conversation,
          date: isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString(),
          isSelected: false,
        };
      });
      formattedConversations.sort(
        (a: { date: string }, b: { date: string }) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setConversations(formattedConversations);
    } catch (error) {
      console.error(`Error fetching conversations in useEffect: ${error}`);
    }
  };

  const handleNewConversation = async () => {
    const newConversation = createNewConversation(userId);
    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...newConversation }),
      });
      if (!response.ok) {
        alert(
          "Invalid request. \n Please try again or contact support (otto.jonas@peacocksalt.co.uk)",
        );
      }
      const data = await response.json();
      const updatedConversation = { ...newConversation, key: data.key };
      setConversations((prevConversations = []) => [
        ...prevConversations.map((conv) => ({ ...conv, isSelected: false })),
        updatedConversation,
      ]);
      setSelectedConversation(updatedConversation);
      setConversationKey(data.key);
    } catch (error) {
      console.log(`error creating new conversation...\n${error}`);
    }
  };

  const handleConversationClick = (key: string) => {
    const updatedConversations = conversations.map((conversation) =>
      conversation.key === key
        ? { ...conversation, isSelected: true }
        : { ...conversation, isSelected: false },
    );
    const selected = updatedConversations.find(
      (conversation) => conversation.key === key,
    );
    setSelectedConversation(selected || null);
    setConversationKey(key);
    setConversations(updatedConversations);
  };

  const handlePinChats = async (key: string) => {
    try {
      const updatedConversation = conversations.map((conversation) =>
        conversation.key === key
          ? { ...conversation, isPinned: !conversation.isPinned }
          : conversation,
      );
      setConversations(updatedConversation);
      const pinnedConversation = updatedConversation.find(
        (conversation) => conversation.key === key,
      );
      if (pinnedConversation) {
        try {
          await fetch(`/api/chats?key=${key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          });
        } catch (error) {
          console.error(`Error pinning conversations: ${error}`);
        }
      }
    } catch (error) {}
  };

  const handleClearAllChats = async () => {
    try {
      const conversationKeys = conversations.map((conv) => conv.key);
      await fetch(`/api/chat/conversations?user_id=${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      for (const key of conversationKeys) {
        await fetch(`/api/chat/messages`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationKey: key }),
        });
      }
      setConversations([]);
      setSelectedConversation(null);
    } catch (error) {
      console.error(`Error clearing the conversations: ${error}`);
    }
  };

  const formatDate = (date: string) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return "Invalid date";
      }
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("en-GB", options).format(parsedDate);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
      <div className="flex items-center px-3 py-3 shrink-0">
        <h2 className="text-lg font-semibold shrink-0">Chats</h2>
        <div className="grid w-8 h-8 ml-2 text-sm font-semibold text-black rounded-full shrink-0 bg-brandWhite place-items-center">
          0
        </div>
        <div className="grow"></div>
        <button>
          <Options className="w-7 h-7" />
        </button>
      </div>
      <div className="flex px-3 space-x-2 shrink-0">
        <div className="relative h-10 rounded-md grow bg-card">
          <input
            className="w-full h-10 pl-4 pr-10 rounded-md bg-card"
            spellCheck={false}
            data-ms-editor={false}
          />
          <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <SearchIcon className="w-5 h-5 text-brandGray" />
          </div>
        </div>
        <div
          className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0"
          onClick={handleNewConversation}
        >
          <PencilSquareIcon className="w-5 h-5 text-black" />
        </div>
      </div>
      <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
        <ListAllIcon className="w-3 h-3" />
        <span className="ml-2 text-sm font-semibold">Conversations</span>
      </div>
      <div className="overflow-y-auto grow">
        {conversations
          .filter((item) => !item.isPinned)
          .map((item) => (
            <ConversationItem
              item={item}
              key={item.key}
              onClick={handleConversationClick}
              onPin={handlePinChats}
              formatDate={formatDate}
            />
          ))}
      </div>
      <div className="px-2 py-3 shrink-0">
        <button
          className="flex items-center justify-center w-full py-2 text-sm font-semibold rounded-md bg-card"
          onClick={handleClearAllChats}
        >
          <Times className="w-5 h-5" />
          <span className="ml-2">Clear All Chats</span>
        </button>
      </div>
    </div>
  );
};

function ConversationItem({
  item,
  onClick,
  onPin,
  formatDate,
}: {
  item: ConversationProps;
  onClick: (key: string) => void;
  onPin: (key: string) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="py-1">
      <div
        className={`px-3 py-2 text-sm w-full rounded-md ${
          item.isSelected ? "selected-conversation" : "bg-card"
        }`}
        onClick={() => onClick(item.key)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold grow line-clamp-1">{item.title}</h3>
          <div className="flex flex-col items-end">
            <span className="pl-2 shrink-0">{formatDate(item.date)}</span>
          </div>
        </div>
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

export default ChatHistory;
