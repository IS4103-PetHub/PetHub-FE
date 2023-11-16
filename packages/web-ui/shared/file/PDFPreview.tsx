import { CloseButton, Text, Stack, Card } from "@mantine/core";

/*
  This thing is the square PDF with the name inside thing that you see when you upload a PDF file into something like a dropzone
*/

export const PDFPreview = ({ file, onRemove }) => {
  return (
    <Card withBorder>
      <Stack>
        <CloseButton
          onClick={(e) => {
            e.stopPropagation(); // Stop the event propagation to the parent dropzone thing
            onRemove();
          }}
          size="xs"
          color="red"
          variant="light"
        />
        <Text
          fz="sm"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.name}
        </Text>
      </Stack>
    </Card>
  );
};
