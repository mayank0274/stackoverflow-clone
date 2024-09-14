"use client";
import MDEditor from "@uiw/react-md-editor";
import React from "react";

type Props = {
  content: string;
};

const MarkdownPreview = ({ content }: Props) => {
  return (
    <MDEditor.Markdown
      source={content}
      style={{
        whiteSpace: "pre-wrap",
        padding: "10px",
        borderRadius: "9px",
        width: "100%",
      }}
    />
  );
};

export default MarkdownPreview;
