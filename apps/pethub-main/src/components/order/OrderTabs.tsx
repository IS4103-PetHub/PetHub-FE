import { Badge, Indicator, Tabs, createStyles } from "@mantine/core";
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
  activeTab: OrderItemStatusEnum;
  setActiveTab: (value: OrderItemStatusEnum) => void;
  orderBarCounts: OrderBarCounts;
}

const useStyles = createStyles((theme) => ({
  inActiveTab: {
    opacity: 0.75,
  },
}));

function OrderStatusBar({
  activeTab,
  setActiveTab,
  orderBarCounts,
}: OrderStatusBarProps) {
  const {
    allCount,
    toBookCount,
    toFulfillCount,
    fulfilledCount,
    expiredCount,
    refundedCount,
  } = orderBarCounts;
  const { classes } = useStyles();

  return (
    <Tabs
      defaultValue={OrderItemStatusEnum.All}
      onTabChange={setActiveTab}
      variant="outline"
      radius="sm"
      mb="sm"
    >
      <Tabs.List grow position="center">
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.All ? "" : classes.inActiveTab
          }
          value={OrderItemStatusEnum.All}
          icon={<IconMenu2 size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={allCount} />}
        >
          All Orders
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.PendingBooking
              ? ""
              : classes.inActiveTab
          }
          value={OrderItemStatusEnum.PendingBooking}
          icon={<IconBulb size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={toBookCount} />}
        >
          To Book
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.PendingFulfillment
              ? ""
              : classes.inActiveTab
          }
          value={OrderItemStatusEnum.PendingFulfillment}
          icon={<IconCalendarEvent size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={toFulfillCount} />}
        >
          To Fulfill
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.Fulfilled
              ? ""
              : classes.inActiveTab
          }
          value={OrderItemStatusEnum.Fulfilled}
          icon={<IconBrowserCheck size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={fulfilledCount} />}
        >
          Fulfilled
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.Expired ? "" : classes.inActiveTab
          }
          value={OrderItemStatusEnum.Expired}
          icon={<IconClockExclamation size="1rem" color="gray" />}
          rightSection={<OrderItemTabBadge count={expiredCount} />}
        >
          Expired
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.Refunded
              ? ""
              : classes.inActiveTab
          }
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
