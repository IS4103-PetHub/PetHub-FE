import { Center, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface CartIconProps {
  size: number;
}

const CartIcon = ({ size }: CartIconProps) => {
  return (
    <Center>
      <Text fw={500} size="md" mr={5}>
        My cart
      </Text>
      <div>
        <IconShoppingCart size="1.25rem" />
        <span>{size}</span>
      </div>
    </Center>
  );
};

export default CartIcon;
