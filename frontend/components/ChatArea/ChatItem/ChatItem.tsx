import React from "react";
import { MessageItem } from "../ChatArea";
import GPTLogo from "../../icons/GPTLogo";
import ThumbsUp from "../../icons/ThumbsUp";
import ThumbsDown from "../../icons/ThumbsDown";

interface Props {
  item: MessageItem;
  onThumbsDown: (message: MessageItem) => void;
}

const ChatItem: React.FC<Props> = ({ item, onThumbsDown }) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit"
    }
    return new Intl.DateTimeFormat("en-GB", options).format(date)
  }

  const sentDate = new Date(item.timestamp)

  return (
    <div className="py-2" key={item.key} data-testid="chat-item">
      <div className="flex p-2 rounded-md gb-item">
        <div className="w-12 shrink-0">
            <div className="grid w-11 h-11 place-items-center">
              {item.sender === "user" ? (
                <div className = "w-10 h-10 bg-center gb-cover rounded-full"
                style={{}}
                ></div>
              ) : (
                <div className = "grid rounded-full w-9 h-9 place-items-center gbg-brandWhite">
                  <GPTLogo className="w-6 h-6 text-blue-900" />
                </div>
              )}
            </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between h-10 px-3 grow text-brandGray">
            <div className="text-sm">{formatDate(sentDate)}</div>
            {item.sender !== "user" && (
              <div className="inline-flex items-center space-x-2">
                <button className={`grid rounded-md w-7 h-7 place-items-center ${item.rating === "good" ? "bg-blue-500" : ""}`}>
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className = {`grid rounded-md w-7 h-7 place-items-center ${item.rating === "bad" ? "bg-red-500": ""}`} onClick={() => onThumbsDown(item)}>
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className = {`px-3 pb-3 ${item.sender === "user" ? "text-white" : "text-white"}`} dangerouslySetInnerHTML={{ __html: item.content}} />
        </div>
      </div>
    </div>
  );
};

export default ChatItem
