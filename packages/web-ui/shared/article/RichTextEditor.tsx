import { Box } from "@mantine/core";
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

interface RichTextEditorProps {
  article: string;
  setArticle?: (article: string) => void;
  viewOnly?: boolean;
}

export default function RichTextEditor({
  article,
  setArticle,
  viewOnly,
}: RichTextEditorProps) {
  return (
    <Box {...(viewOnly ? {} : { style: { height: "calc(55vh - 40px)" } })}>
      <ReactQuill
        theme={viewOnly ? "bubble" : "snow"}
        value={article}
        onChange={setArticle}
        readOnly={viewOnly}
        {...(viewOnly
          ? {}
          : {
              placeholder:
                "Write about the latest platform updates or helpful tips for pet management. Choose from announcements, events, or general advice to engage and inform our pet owner community",
            })}
        style={{ height: "100%" }}
      />
    </Box>
  );
}
