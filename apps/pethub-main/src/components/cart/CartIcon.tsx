import { Center } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface CartIconProps {
  size: number;
}

const CartIcon = ({ size }: CartIconProps) => {
  return (
    <Center>
      My cart &nbsp;
      <div>
        <IconShoppingCart size="1.25rem" />
        <span>{size}</span>
      </div>
    </Center>
  );
};

export default CartIcon;
