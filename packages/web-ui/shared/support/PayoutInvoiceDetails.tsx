import {
  useMantineTheme,
  Grid,
  Text,
  Box,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { IconFileDownload, IconReportMoney } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  SupportTicket,
  formatISODayDateTime,
  formatNumber2Decimals,
} from "shared-utils";

interface PayoutInvoiceDetailsProps {
  supportTicket: SupportTicket;
  isAdmin?: boolean;
}

export default function PayoutInvoiceDetails({
  supportTicket,
  isAdmin,
}: PayoutInvoiceDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();

  const generateItemGroup = (
    title: string,
    content: ReactNode,
    colProps: any = {},
  ) => {
    return (
      <>
        <Grid.Col span={7} {...colProps}>
          <Text fw={500}>{title}</Text>
        </Grid.Col>
        <Grid.Col span={17} {...colProps}>
          {content}
        </Grid.Col>
      </>
    );
  };

  return (
    <Box mb="md">
      <Group position="apart">
        <Text fw={600} size="md">
          <IconReportMoney size="1rem" color={theme.colors.indigo[5]} />{" "}
          &nbsp;Payout Details
        </Text>
        {supportTicket.payoutInvoice.attachmentURL && (
          <Button
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              window.open(supportTicket.payoutInvoice.attachmentURL, "_blank");
            }}
            leftIcon={<IconFileDownload size={"1.5rem"} />}
          >
            Download Invoice
          </Button>
        )}
      </Group>
      <Grid columns={24} mt="xs">
        {generateItemGroup(
          "Payout Invoice ID",
          <Text>{supportTicket.payoutInvoice.invoiceId}</Text>,
        )}
        {generateItemGroup(
          "Total Amount",
          <Text>
            $ {formatNumber2Decimals(supportTicket.payoutInvoice.totalAmount)}
          </Text>,
        )}
        {generateItemGroup(
          "Commission Amount",
          <Text>
            ${" "}
            {formatNumber2Decimals(
              supportTicket.payoutInvoice.commissionCharge,
            )}
          </Text>,
        )}
        {generateItemGroup(
          "Payout Date",
          <Text>
            {formatISODayDateTime(supportTicket.payoutInvoice.createdAt)}
          </Text>,
        )}
        {generateItemGroup(
          "Payment ID",
          <Text>{supportTicket.payoutInvoice.paymentId}</Text>,
        )}
      </Grid>
      <Divider mt="lg" mb="lg" />
    </Box>
  );
}
