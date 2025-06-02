import React from "react";
import ChatIcon from "../icons/ChatIcon/ChatIcon";
import { useRouter } from "next/router";
import SettingsIcon from "../icons/SettingsIcon";
import LogoutIcon from "../icons/LogoutIcon";
import DocumentIcon from "../icons/DocumentIcon/DocumentIcon";

// ----------------------------------------------------------------------------------------------------------------------
// TODO
// 
// TOFIX
//
//  ----------------------------------------------------------------------------------------------------------------------

type Props = {};

const Sidebar = () => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const handleChatClick = () => {
    router.push("/chat");
  };

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const handleDocumentClick = () => {
    router.push("/documents");
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex flex-col items-center w-16 h-screen pt-4 bg-black">
      <div className="grid w-10 h-10 rounded-full bg-brandWhite shrink-0 place-items-center">
        <ChatIcon className="w-6 h-6 text-black" />
      </div>
      <div className="flex flex-col pt-24 space-y-4 grow">
        <button
          className={`grid w-10 h-10 rounded-md place-items-center ${
            isActive("/documents")
              ? "text-black bg-brandWhite"
              : "text-brandGray"
          }`}
          onClick={handleChatClick}
        >
          <ChatIcon className="w-5 h-5" />
        </button>
        <button
          className={`grid w-10 h-10 rounded-md place-items-center ${
            isActive("/chat") ? "text-black bg-brandWhite" : "text-brandGray"
          }`}
          onClick={handleDocumentClick}
        >
          <DocumentIcon className="w-5 h-5 text-black" />
        </button>
        <button
          className={`grid w-10 h-10 rounded-md place-items-center ${
            isActive("/chat") ? "text-black bg-brandWhite" : "text-brandGray"
          }`}
          onClick={handleSettingsClick}
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col pb-4 space-y -4 shrink-0">
        <button
          className="grid w-10 h-10 text-white rounded-md place-items-center bg-card"
          onClick={handleLogout}
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
