import React from "react";
import Info from "../components/Info/Info";
import DocumentHistory from "../components/DocumentHistory/DocumentHistory";
import Sidebar from "../components/Sidebar/Sidebar";
import DocumentHeader from "../components/DocumentHeader/DocumentHeader";

const Documents = () => {
  return (
    <>
        <DocumentHeader />
      <Sidebar />
      <DocumentHistory />
      <Info />
    </>
  );
};

export default Documents;
