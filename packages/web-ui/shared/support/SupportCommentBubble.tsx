import {
  Avatar,
  Box,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Comment, formatISODateTimeShort } from "shared-utils";
import ImageCarousel from "web-ui/shared/ImageCarousel";

interface SupportCommentAccordionProps {
  comment: Comment;
  userId: number;
  isAdmin: boolean;
  userName?: string;
}

export default function SupportCommentBubble({
  comment,
  userId,
  isAdmin,
  userName,
}: SupportCommentAccordionProps) {
  const theme = useMantineTheme();
  const [focusedImage, setFocusedImage] = useState(null);
  const textRef = useRef(null);
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const [textExceedsLineClamp, setTextExceedsLineClamp] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const textHeight = textRef.current.clientHeight;
      if (textHeight > lineHeight * 2) {
        setTextExceedsLineClamp(true);
      }
    }
  }, [comment]);

  const handleImageThumbnailClick = (index) => {
    if (focusedImage === index) {
      setFocusedImage(null);
      setShowImageCarousel(false);
    } else {
      setFocusedImage(index);
      setShowImageCarousel(true);
    }
  };

  const isCurrentUsersMessage = userId === comment.userId;

  const commentImageCarouselCol = (
    <Grid.Col span={6} mt={10}>
      <Box ml="md" mr="md">
        <ImageCarousel
          attachmentURLs={comment?.attachmentURLs}
          altText="Comment Image"
          imageHeight={250}
          focusedImage={focusedImage}
          setFocusedImage={setFocusedImage}
        />
      </Box>
    </Grid.Col>
  );

  return (
    <Box key={comment.commentId} mb="xl">
      <Group position={isCurrentUsersMessage ? "right" : "left"}>
        {isCurrentUsersMessage ? (
          <Group mb={5}>
            <Text size="md" weight={600} mr={-5}>
              You
            </Text>
            <Avatar radius="xl" />
          </Group>
        ) : (
          <Group mb={5}>
            <Avatar radius="xl" />
            <Text size="md" weight={600} ml={-5}>
              {isAdmin ? userName : "Admin"}
            </Text>
          </Group>
        )}
      </Group>
      <Paper
        shadow="sm"
        radius="lg"
        withBorder
        p="md"
        style={{
          backgroundColor: isCurrentUsersMessage
            ? theme.colors.gray[2]
            : theme.colors.blue[2],
        }}
        w="80%"
        ml={isCurrentUsersMessage ? "auto" : 0}
      >
        <Text>{comment.comment}</Text>

        <Grid columns={12} mt="xl">
          <Grid.Col span={12} {...(textExceedsLineClamp ? { mt: -30 } : {})}>
            <Box ml="md" mr="md">
              {comment?.attachmentURLs?.length > 0 && (
                <Flex wrap="wrap" justify="start" align="center" gap="xs">
                  {comment.attachmentURLs.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100px",
                        height: "60px",
                        position: "relative",
                        border: index === focusedImage ? "1.5px red solid" : "",
                        overflow: "hidden",
                        marginRight: "10px",
                      }}
                    >
                      <>
                        <Image
                          radius="md"
                          src={url}
                          fit="cover"
                          w="full"
                          h="full"
                          alt="Comment Image Thumbnail"
                          onClick={() => handleImageThumbnailClick(index)}
                          style={{
                            cursor:
                              focusedImage === index ? "zoom-out" : "zoom-in",
                          }}
                        />
                      </>
                    </div>
                  ))}
                </Flex>
              )}
            </Box>
            {showImageCarousel && commentImageCarouselCol}
          </Grid.Col>
        </Grid>
        <Text align="right" size="sm" c={theme.colors.gray[7]}>
          Sent: {formatISODateTimeShort(comment.createdAt)}
        </Text>
      </Paper>
    </Box>
  );
}
