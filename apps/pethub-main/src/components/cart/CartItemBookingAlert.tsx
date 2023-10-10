import { Alert, Text, AlertProps } from "@mantine/core";
import React from "react";
import { formatISODayDateTime } from "shared-utils";
import { CartItemBookingSelection } from "@/types/types";

interface CartItemBookingAlertProps extends AlertProps {
  isValid: boolean;
  bookingSelection?: CartItemBookingSelection;
}

// This might not be needed anymore as per PH-264
const CartItemBookingAlert = ({
  isValid,
  bookingSelection,
  ...props
}: CartItemBookingAlertProps) => {
  if (!bookingSelection) {
    return null;
  }

  return (
    <Alert
      variant="light"
      color={isValid ? "blue" : "red"}
      title={isValid ? "Booking selection" : "Selected time slot unavailable"}
      radius="md"
      mih={80}
      mah={80}
      w="100%"
      {...props}
    >
      {isValid ? (
        <Text size="xs">
          <b>Start: </b>
          {formatISODayDateTime(bookingSelection?.startTime)}
          <b style={{ marginLeft: "8px" }}>End: </b>
          {formatISODayDateTime(bookingSelection?.endTime)}
          {bookingSelection?.petName && (
            <>
              <b style={{ marginLeft: "8px" }}>Pet:</b>{" "}
              {bookingSelection?.petName}
            </>
          )}
        </Text>
      ) : (
        <Text>Please remove this item and re-attempt time slot selection.</Text>
      )}
    </Alert>
  );
};

export default CartItemBookingAlert;
