import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Masonry } from "masonic";
import React, { useState } from "react";
import { getErrorMessageProps } from "shared-utils";
import { useDeletePetLostAndFoundPostById } from "@/hooks/pet-lost-and-found";
import { PetLostAndFound } from "@/types/types";
import LostAndFoundPostModal from "./LostAndFoundPostModal";
import PostCard from "./PostCard";

const COL_GUTTER = 15;
const MIN_WIDTH = 350;
const OVERSCAN = 5;

interface LostAndFoundMasonryGridProps {
  posts: PetLostAndFound[];
  sessionUserId: number;
  refetch(): void;
}

const LostAndFoundMasonryGrid = ({
  posts,
  sessionUserId,
  refetch,
}: LostAndFoundMasonryGridProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPost, setSelectedPost] = useState<PetLostAndFound>();

  const items = posts.map((post) => {
    return {
      id: post.petLostAndFoundId,
      title: post.title,
      description: post.description,
      requestType: post.requestType,
      lastSeenDate: post.lastSeenDate,
      lastSeenLocation: post.lastSeenLocation,
      petOwnerName: `${post.petOwner.firstName} ${post.petOwner.lastName}`,
      contactNumber: post.contactNumber,
      dateCreated: post.dateCreated,
      petName: post.pet ? post.pet.petName : "",
      petType: post.pet ? post.pet.petType : "",
      petDateOfBirth: post.pet?.dateOfBirth ? post.pet.dateOfBirth : "",
      attachmentURL: post.attachmentURLs[0],
      isResolved: post.isResolved,
      userId: post.userId,
    };
  });

  const deletePetLostAndFoundPostMutation = useDeletePetLostAndFoundPostById();
  const handleDeletePost = async (id: number) => {
    try {
      await deletePetLostAndFoundPostMutation.mutateAsync(id);
      refetch();
      notifications.show({
        message: "Pet Lost and Found Post Deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        ...getErrorMessageProps("Error Deleting Post", error),
      });
    }
  };

  const handleUpdatePost = (id: number) => {
    setSelectedPost(posts.find((post) => post.petLostAndFoundId === id));
    open();
  };

  const MasonryPostCard = ({
    data: {
      id,
      title,
      description,
      requestType,
      lastSeenDate,
      lastSeenLocation,
      petOwnerName,
      contactNumber,
      dateCreated,
      petName,
      petType,
      petDateOfBirth,
      attachmentURL,
      isResolved,
      userId,
    },
  }) => (
    <PostCard
      id={id}
      title={title}
      description={description}
      requestType={requestType}
      lastSeenDate={lastSeenDate}
      lastSeenLocation={lastSeenLocation}
      petOwnerName={petOwnerName}
      contactNumber={contactNumber}
      dateCreated={dateCreated}
      petName={petName}
      petType={petType}
      petDateOfBirth={petDateOfBirth}
      attachmentURL={attachmentURL}
      isResolved={isResolved}
      userId={userId}
      sessionUserId={sessionUserId}
      onDelete={handleDeletePost}
      onUpdate={handleUpdatePost}
    />
  );

  return (
    <>
      <Masonry
        // create a new layout if the items change
        key={JSON.stringify(items)}
        // Provides the data for our grid items
        items={items}
        // Adds space between the grid cells
        columnGutter={COL_GUTTER}
        // Sets the minimum column width
        columnWidth={MIN_WIDTH}
        // Pre-renders windows worth of content
        overscanBy={OVERSCAN}
        // This is the grid item component
        render={MasonryPostCard}
      />
      <LostAndFoundPostModal
        petOwnerId={sessionUserId}
        opened={opened}
        close={close}
        post={selectedPost}
        refetch={refetch}
      />
    </>
  );
};

export default LostAndFoundMasonryGrid;
