import { Button } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

interface FavouriteButtonProps {
  text: string;
  isFavourite: boolean;
  className?: string;
  size: number;
  onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const FavouriteButton = ({
  text,
  isFavourite,
  className,
  size,
  onClick,
}: FavouriteButtonProps) => {
  if (text) {
    return (
      <Button
        onClick={(event) => onClick(event)}
        variant={"subtle"}
        color={isFavourite ? "blue" : "gray"}
        {...(className && { className })}
        leftIcon={
          <IconHeart size={size} fill={isFavourite ? "blue" : "none"} />
        }
      >
        {text}
      </Button>
    );
  } else {
    return (
      <Button
        onClick={(event) => onClick(event)}
        variant={"subtle"}
        color={isFavourite ? "gray" : "gray"}
        {...(className && { className })}
      >
        <IconHeart size={size} fill={isFavourite ? "white" : "none"} />
      </Button>
    );
  }
};

export default FavouriteButton;
