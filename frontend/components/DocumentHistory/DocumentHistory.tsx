import React from "react";
import Options from "../icons/Options";
import SearchIcon from "../icons/SearchIcon";
import PencilSquareIcon from "../icons/PencilSquareIcon";
import ListAllIcon from "../icons/ListAllIcon";

const DocumentHistory = () => {
  return (
    <>
      <div className="fixed top-0 z-10 flex flex-col h-screen px-2 border-r-2 left-16 w-80 border-r-line bg-body">
        <div className="flex items-center px-3 py-3 shrink-0">
          <h2 className="text-lg font-semibold shrink-0">Documents</h2>
          <div className="grow"></div>
          <button>
            <Options className="h-5 w-7" />
          </button>
        </div>
        <div className="flex px-3 space-x-2 shrink-0">
          <div className="relative h-10 bg-red-100 rounded-md grow">
            <input
              className="w-full h-10 pl-4 rounded-md bg-card"
              spellCheck={false}
              data-ms-editor={false}
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-0 grid w-10 place-items-center">
              <SearchIcon className="w-5 h-5 text-brandGray" />
            </div>
          </div>
          <div className="grid w-10 h-10 rounded-md bg-brandWhite place-items-center shrink-0">
            <PencilSquareIcon className="w-5 h-5 text-black" />
          </div>
        </div>
        <div className="flex items-center px-3 mt-4 mb-1 uppercase shrink-0">
            <ListAllIcon className="w-3 h-3" />
            <span className="ml-2 text-sm font-semibold">Documents</span>
        </div>
      </div>
    </>
  );
};

export default DocumentHistory;
