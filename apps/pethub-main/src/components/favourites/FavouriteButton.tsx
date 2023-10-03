import { Button, createStyles, useMantineTheme } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  noTextButton: {
    background: "transparent !important", // ensure the background is transparent
    "&:hover, &:focus": {
      background: "transparent !important", // make sure it stays transparent on hover and focus
      boxShadow: "none !important", // remove any shadows
    },
  },
}));

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
  const theme = useMantineTheme();
  const { classes } = useStyles();
  if (text) {
    return (
      <Button
        onClick={(event) => onClick(event)}
        variant={"subtle"}
        color={isFavourite ? theme.colors.indigo[5] : "gray"}
        {...(className && { className })}
        leftIcon={
          <IconHeart
            size={size}
            fill={isFavourite ? theme.colors.indigo[5] : "none"}
          />
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
        className={`${classes.noTextButton} ${className || ""}`}
      >
        <IconHeart size={size} fill={isFavourite ? "white" : "none"} />
      </Button>
    );
  }
};

export default FavouriteButton;
