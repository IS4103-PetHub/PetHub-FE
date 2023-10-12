import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Container,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendar,
  IconNotes,
  IconPackage,
  IconUserCircle,
} from "@tabler/icons-react";
import { IconFileDownload } from "@tabler/icons-react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import {
  OrderItemStatus,
  ServiceCategoryEnum,
  formatEnumValueToLowerCase,
  formatStringToLetterCase,
} from "shared-utils";
import { PageTitle } from "web-ui";
import { OrderItem } from "@/types/types";

interface PBOrdersDetailsProps {
  userId: number;
  order: OrderItem;
}

export default function PBOrdersDetails({
  userId,
  order,
}: PBOrdersDetailsProps) {
  const theme = useMantineTheme();
  console.log("ORDERS", order);

  return (
    <>
      <Head>
        <title>
          {order.orderItemId} - {order.itemName}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle
            title={`${order.serviceListing.title} - ${order.itemName}`}
          />
          <ActionIcon
            size="xl"
            radius="xl"
            color={theme.primaryColor}
            onClick={() => {
              console.log("DOWNLOADING INVOICE");
            }}
          >
            <IconFileDownload size={"3.25rem"} />
          </ActionIcon>
        </Group>
        <Accordion radius="md" variant="filled" mt="xl" mb={80} multiple>
          <Accordion.Item value="OrderDetails">
            <Accordion.Control
              icon={<IconPackage color={theme.colors.indigo[5]} />}
            >
              <Group>
                <Text size="xl" weight={600}>
                  Order Details
                </Text>
                <Badge>{formatStringToLetterCase(order.orderItemStatus)}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Order Item Name:</Text>
                  </Box>
                  <Text>{order.itemName}</Text>
                </Grid.Col>
                {/* <Grid.Col span={6}>
                                    <Box>
                                        <Text weight="600">Voucher Code:</Text>
                                        <Text>{order.voucherCode}</Text>
                                    </Box>
                                </Grid.Col> */}
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Expiry Date:</Text>
                    <Text>{order.expiryDate}</Text>
                  </Box>
                </Grid.Col>
                {/* 
                                    INFORMATION ON THE FINANCIAL ASPECTS
                                    FIND a better way to present the order and invocie details
                                */}
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Item Price:</Text>
                    <Text>$ {order.itemPrice}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Quantity:</Text>
                    <Text>{order.quantity}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Net Price:</Text>
                    <Text>$ {order.quantity * order.itemPrice}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Rate:</Text>
                    <Text>$ {order.invoice.commissionRate}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Amount:</Text>
                    <Text>
                      ${" "}
                      {(
                        (order.invoice.commissionRate / 100) *
                        (order.quantity * order.itemPrice)
                      ).toFixed(2)}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Total Amount:</Text>
                    <Text>
                      ${" "}
                      {(
                        order.quantity * order.itemPrice -
                        (order.invoice.commissionRate / 100) *
                          (order.quantity * order.itemPrice)
                      ).toFixed(2)}
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="BookingDetails">
            <Accordion.Control
              icon={<IconCalendar color={theme.colors.indigo[5]} />}
            >
              <Text size="xl" weight={600}>
                Booking Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel ml={5} mr={5}>
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Booking Id:</Text>
                    <Text>{order.booking.bookingId}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Date Created:</Text>
                    <Text>
                      {new Date(order.booking.dateCreated).toLocaleString()}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Start time:</Text>
                    <Text>
                      {new Date(order.booking.startTime).toLocaleString()}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">End time:</Text>
                    <Text>
                      {new Date(order.booking.endTime).toLocaleString()}
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="PetOwnerDetails">
            <Accordion.Control
              icon={<IconUserCircle color={theme.colors.indigo[5]} />}
            >
              <Text size="xl" weight={600}>
                Pet Owner Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel ml={5} mr={5}>
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">First name:</Text>
                    <Text>{order.booking.petOwner.firstName}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Last name:</Text>
                    <Text>{order.booking.petOwner.lastName}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Contact Number:</Text>
                    <Text>{order.booking.petOwner.contactNumber}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Email:</Text>
                    <Text>{order.booking.petOwner.email}</Text>
                  </Box>
                </Grid.Col>

                {order.booking.pet && (
                  <>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Pet name:</Text>
                        <Text>{order.booking.pet.petName}</Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Pet Type:</Text>
                        <Text>
                          {formatStringToLetterCase(order.booking.pet.petType)}
                        </Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Gender:</Text>
                        <Text>
                          {formatStringToLetterCase(order.booking.pet.gender)}
                        </Text>
                      </Box>
                    </Grid.Col>
                  </>
                )}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="ServiceListingDetails">
            <Accordion.Control
              icon={<IconNotes color={theme.colors.indigo[5]} />}
            >
              <Text size="xl" weight={600}>
                Service Listing Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel ml={5} mr={5}>
              <Grid>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Title:</Text>
                    <Text>{order.serviceListing.title}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Category:</Text>
                    <Text>
                      {formatStringToLetterCase(order.serviceListing.category)}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Box>
                    <Text weight="600">Description:</Text>
                    <Text>{order.serviceListing.description}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Base Price:</Text>
                    <Text>$ {order.serviceListing.basePrice}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Duration:</Text>
                    <Text>{order.serviceListing.duration} mins</Text>
                  </Box>
                </Grid.Col>
                {/* Address? */}
                {/* Tags? */}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="RefundDetails">
            <Accordion.Control>
              <Text size="xl" weight={600}>
                Refund Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel ml={5} mr={5}>
              Refund DEETS
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  // TODO: once intergration is done, use endpoint to get order information
  // const order = await (await api.get(`/orders/${id}`)).data;
  const order = dummyOrder;
  const session = await getSession(context);
  if (!session) return { props: { id } };
  const userId = session.user["userId"];

  return { props: { userId, order } };
}

const dummyOrder = {
  orderItemId: 1,
  itemName: "Product A",
  itemPrice: 39.99,
  quantity: 2,
  expiryDate: "2023-12-31",
  voucherCode: "ABCD1234",
  orderItemStatus: OrderItemStatus.PENDING_BOOKING,
  invoiceId: 1,
  invoice: {
    invoiceId: 1,
    commissionRate: 5,
    totalPrice: 79.98,
    miscCharge: 5.0,
    createdAt: "2023-01-15",
  },
  serviceListingId: 0,
  serviceListing: {
    serviceListingId: 1,
    title: "Pet Grooming Service",
    description: "Professional pet grooming service",
    basePrice: 39.99,
    category: ServiceCategoryEnum.PetGrooming,
    tags: [
      {
        tagId: 2,
        name: "Not Free",
        dateCreated: "2023-10-11T04:25:10.613Z",
        lastUpdated: null,
      },
      {
        tagId: 3,
        name: "Healthy",
        dateCreated: "2023-10-11T04:25:10.616Z",
        lastUpdated: null,
      },
    ],
    dateCreated: "2023-01-10",
    attachmentKeys: [],
    attachmentURLs: [],
    addresses: [
      {
        addressId: 2,
        addressName: "Greenwood Gardens",
        line1: "456 Elm Avenue",
        line2: null,
        postalCode: "67890",
        petBusinessId: 1,
        petBusinessApplicationId: null,
      },
    ],
    petBusinessId: 1,
    calendarGroupId: 1,
    duration: 60,
  },
  bookingId: 3,
  booking: {
    bookingId: 3,
    dateCreated: "2023-10-11T04:25:10.739Z",
    lastUpdated: null,
    startTime: "2023-10-20T05:00:00.000Z",
    endTime: "2023-10-20T06:00:00.000Z",
    serviceListingId: 1,
    timeSlotId: 24,
    petId: 1,
    pet: {
      petId: 8,
      petName: "Squeaky",
      petType: "RODENT",
      gender: "MALE",
      dateOfBirth: "2021-01-05T00:00:00.000Z",
      petWeight: 0.2,
      microchipNumber: "TUV333",
      attachmentKeys: [],
      attachmentURLs: [],
      dateCreated: "2023-10-11T04:25:08.992Z",
      lastUpdated: null,
      petOwnerId: 15,
    },
    petOwnerId: 9,
    petOwner: {
      firstName: "Jung",
      lastName: "Park",
      contactNumber: "65432109",
      dateOfBirth: "1986-09-02T00:00:00.000Z",
      email: "petowner8@example.com",
    },
  },
};
