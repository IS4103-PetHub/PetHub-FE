import { Box } from "@mantine/core";
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type RichTextEditorProps = {
  article: string;
  setArticle: (article: string) => void;
};

export default function MyAwesomeTextEditor({
  article,
  setArticle,
}: RichTextEditorProps) {
  return (
    <Box style={{ height: "calc(80vh - 40px)" }}>
      <ReactQuill
        theme="snow"
        value={article}
        onChange={setArticle}
        placeholder="Write about the latest platform updates or helpful tips for pet management. Choose from announcements, events, or general advice to engage and inform our pet owner community"
        readOnly={false}
        style={{ height: "100%" }}
      />
    </Box>
  );
}
