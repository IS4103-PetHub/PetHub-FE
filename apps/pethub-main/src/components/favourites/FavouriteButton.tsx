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
  const icon = <IconHeart size={size} fill={isFavourite ? "red" : "none"} />;
  if (text) {
    return (
      <Button
        onClick={(event) => onClick(event)}
        variant={"subtle"}
        color={isFavourite ? null : "gray"}
        {...(className && { className })}
        leftIcon={icon}
      >
        {text}
      </Button>
    );
  } else {
    return (
      <Button
        onClick={(event) => onClick(event)}
        variant={"subtle"}
        color={isFavourite ? null : "gray"}
        {...(className && { className })}
      >
        {icon}
      </Button>
    );
  }
};

export default FavouriteButton;
