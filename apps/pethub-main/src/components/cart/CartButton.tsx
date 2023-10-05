import { Center, createStyles, useMantineTheme } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface CartIconProps {
  size: number;
}

const useStyles = createStyles((theme) => ({
  iconWrapper: {
    position: "relative",
    display: "inline-block",
  },
  itemCount: {
    position: "absolute",
    bottom: "0",
    right: "0",
    "background-color": "red",
    "border-radius": "50%",
    padding: "2px 5px",
    color: "white",
    "font-size": "0.75rem",
  },
}));

const CartIcon = ({ size }: CartIconProps) => {
  return (
    <Center>
      My cart &nbsp;
      <div className="iconWrapper">
        <IconShoppingCart size="1.25rem" />
        <span className="itemCount">{size}</span>
      </div>
    </Center>
  );
};

export default CartIcon;
