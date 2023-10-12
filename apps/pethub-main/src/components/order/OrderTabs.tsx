import { Badge, Tabs } from "@mantine/core";
import {
  IconBrowserCheck,
  IconBulb,
  IconCalendarEvent,
  IconClockExclamation,
  IconCreditCard,
  IconMenu2,
} from "@tabler/icons-react";
import { OrderBarCounts, OrderItemStatusEnum } from "shared-utils";
import OrderItemTabBadge from "./OrderItemTabBadge";

interface OrderStatusBarProps {
  setActiveTab: (value: OrderItemStatusEnum) => void;
  orderBarCounts: OrderBarCounts;
}

function OrderStatusBar({ setActiveTab, orderBarCounts }: OrderStatusBarProps) {
  const {
    allCount,
    toBookCount,
    toFulfillCount,
    fulfilledCount,
    expiredCount,
    refundedCount,
  } = orderBarCounts;

  return (
    <Tabs
      defaultValue={OrderItemStatusEnum.All}
      onTabChange={setActiveTab}
      variant="outline"
      radius="md"
    >
      <Tabs.List grow position="center">
        <Tabs.Tab
          value={OrderItemStatusEnum.All}
          icon={<IconMenu2 size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={allCount} />}
        >
          All Orders
        </Tabs.Tab>
        <Tabs.Tab
          value={OrderItemStatusEnum.PendingBooking}
          icon={<IconBulb size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={toBookCount} />}
        >
          To Book
        </Tabs.Tab>
        <Tabs.Tab
          value={OrderItemStatusEnum.PendingFulfillment}
          icon={<IconCalendarEvent size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={toFulfillCount} />}
        >
          To Fulfill
        </Tabs.Tab>
        <Tabs.Tab
          value={OrderItemStatusEnum.Fulfilled}
          icon={<IconBrowserCheck size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={fulfilledCount} />}
        >
          Fulfilled
        </Tabs.Tab>
        <Tabs.Tab
          value={OrderItemStatusEnum.Expired}
          icon={<IconClockExclamation size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={expiredCount} />}
        >
          Expired
        </Tabs.Tab>
        <Tabs.Tab
          value={OrderItemStatusEnum.Refunded}
          icon={<IconCreditCard size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={refundedCount} />}
        >
          Refunded
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

export default OrderStatusBar;
