import {
  ActionIcon,
  Badge,
  Indicator,
  Tabs,
  createStyles,
} from "@mantine/core";
import {
  IconBrowserCheck,
  IconBulb,
  IconCalendarEvent,
  IconCalendarTime,
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
  const { classes } = useStyles();

  if (!orderBarCounts) {
    return null;
  }

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
      value={activeTab}
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
          rightSection={
            <OrderItemTabBadge
              count={allCount}
              isActive={activeTab === OrderItemStatusEnum.All}
            />
          }
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
          icon={<IconCalendarTime size="1rem" color="gray" />}
          rightSection={
            <OrderItemTabBadge
              count={toBookCount}
              isActive={activeTab === OrderItemStatusEnum.PendingBooking}
            />
          }
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
          rightSection={
            <OrderItemTabBadge
              count={toFulfillCount}
              isActive={activeTab === OrderItemStatusEnum.PendingFulfillment}
            />
          }
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
          rightSection={
            <OrderItemTabBadge
              count={fulfilledCount}
              isActive={activeTab === OrderItemStatusEnum.Fulfilled}
            />
          }
        >
          Fulfilled
        </Tabs.Tab>
        <Tabs.Tab
          className={
            activeTab === OrderItemStatusEnum.Expired ? "" : classes.inActiveTab
          }
          value={OrderItemStatusEnum.Expired}
          icon={<IconClockExclamation size="1rem" color="gray" />}
          rightSection={
            <OrderItemTabBadge
              count={expiredCount}
              isActive={activeTab === OrderItemStatusEnum.Expired}
            />
          }
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
          rightSection={
            <OrderItemTabBadge
              count={refundedCount}
              isActive={activeTab === OrderItemStatusEnum.Refunded}
            />
          }
        >
          Refunds
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

export default OrderStatusBar;
