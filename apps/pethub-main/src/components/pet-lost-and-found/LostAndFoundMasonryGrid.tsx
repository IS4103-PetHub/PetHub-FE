import { Masonry } from "masonic";
import React from "react";
import { PetLostAndFound } from "@/types/types";
import PostCard from "./PostCard";

interface LostAndFoundMasonryGridProps {
  posts: PetLostAndFound[];
}

const LostAndFoundMasonryGrid = ({ posts }: LostAndFoundMasonryGridProps) => {
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
    };
  });

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
    />
  );

  return (
    <Masonry
      // Provides the data for our grid items
      items={items}
      // Adds space between the grid cells
      columnGutter={15}
      // Sets the minimum column width
      columnWidth={400}
      // Pre-renders windows worth of content
      overscanBy={3}
      // This is the grid item component
      render={MasonryPostCard}
    />
  );
};

export default LostAndFoundMasonryGrid;
