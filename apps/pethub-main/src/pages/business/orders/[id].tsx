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
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { OrderItem, formatStringToLetterCase } from "shared-utils";
import { PageTitle } from "web-ui";
import LargeBackButton from "web-ui/shared/LargeBackButton";
import api from "@/api/axiosConfig";
import { Pet, PetOwner } from "@/types/types";

interface PBOrdersDetailsProps {
  order: OrderItem;
  petOwner: PetOwner;
  pet: Pet;
}

export default function PBOrdersDetails({
  order,
  petOwner,
  pet,
}: PBOrdersDetailsProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <>
      <Head>
        <title>
          {order.orderItemId} - {order.itemName}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LargeBackButton
        text="Back to Order Management"
        onClick={() => {
          router.push("/business/orders");
        }}
        size="sm"
        mb="md"
      />
      <Container mt="xl" mb="xl">
        <Group position="apart">
          <PageTitle title={`${order.itemName}`} />
          <ActionIcon
            size="xl"
            radius="xl"
            color={theme.primaryColor}
            onClick={function (): void {
              window.open(order.attachmentURL, "_blank");
            }}
          >
            <IconFileDownload size={"3.25rem"} />
          </ActionIcon>
        </Group>
        <Accordion
          radius="md"
          variant="filled"
          mt="xl"
          mb={80}
          multiple
          value={[
            "OrderDetails",
            "BookingDetails",
            "PetOwnerDetails",
            "ServiceListingDetails",
          ]}
        >
          <Accordion.Item value="OrderDetails">
            <Accordion.Control
              icon={<IconPackage color={theme.colors.indigo[5]} />}
            >
              <Group>
                <Text size="xl" weight={600}>
                  Order Details
                </Text>
                <Badge>{formatStringToLetterCase(order.status)}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel mb="xs">
              <Grid>
                <Grid.Col span={12}>
                  <Box>
                    <Text weight="600">Order Item Name:</Text>
                  </Box>
                  <Text>{order.itemName}</Text>
                </Grid.Col>
                {/* <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Payment Id:</Text>
                  </Box>
                  <Text>{order.invoice.paymentId}</Text>
                </Grid.Col> */}
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Expiry Date:</Text>
                    <Text>{dayjs(order.expiryDate).format("YYYY-MM-DD")}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box>
                    <Text weight="600">Date Created:</Text>
                    <Text>
                      {dayjs(order.invoice.createdAt).format("YYYY-MM-DD")}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Item Price:</Text>
                    <Text>$ {order.itemPrice}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Miscellaneous fee :</Text>
                    <Text>$ {(0.07 * order.itemPrice).toFixed(2)}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Total Price :</Text>
                    <Text>$ {(1.07 * order.itemPrice).toFixed(2)}</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Rate:</Text>
                    <Text>{order.commissionRate * 100} % </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Commission Amount:</Text>
                    <Text>
                      $ {(order.commissionRate * order.itemPrice).toFixed(2)}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Text weight="600">Net Total:</Text>
                    <Text>
                      ${" "}
                      {(
                        1.07 * order.itemPrice -
                        order.commissionRate * order.itemPrice
                      ).toFixed(2)}
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          {order.booking ? (
            <>
              <Accordion.Item value="BookingDetails">
                <Accordion.Control
                  icon={<IconCalendar color={theme.colors.indigo[5]} />}
                >
                  <Text size="xl" weight={600}>
                    Booking Timings
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
                          {dayjs(order.booking.dateCreated).format(
                            "YYYY-MM-DD",
                          )}
                        </Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">Start time:</Text>
                        <Text>
                          {dayjs(order.booking.startTime).format(
                            "YYYY-MM-DD, HH:MM",
                          )}
                        </Text>
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Box>
                        <Text weight="600">End time:</Text>
                        <Text>
                          {dayjs(order.booking.endTime).format(
                            "YYYY-MM-DD, HH:MM",
                          )}
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
                    {petOwner && (
                      <>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">First name:</Text>
                            <Text>{petOwner.firstName}</Text>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Last name:</Text>
                            <Text>{petOwner.lastName}</Text>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Contact Number:</Text>
                            <Text>{petOwner.contactNumber}</Text>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Email:</Text>
                            <Text>{petOwner.user.email}</Text>
                          </Box>
                        </Grid.Col>
                      </>
                    )}

                    {pet && (
                      <>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Pet name:</Text>
                            <Text>{pet.petName}</Text>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Pet Type:</Text>
                            <Text>{formatStringToLetterCase(pet.petType)}</Text>
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Box>
                            <Text weight="600">Gender:</Text>
                            <Text>{formatStringToLetterCase(pet.gender)}</Text>
                          </Box>
                        </Grid.Col>
                      </>
                    )}
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
            </>
          ) : null}
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
                {/* Address: not sure if just showing the name is enough */}
                {order.serviceListing.addresses.length != 0 && (
                  <Grid.Col span={12}>
                    <Box>
                      <Text weight="600">Address:</Text>
                      {order.serviceListing.addresses.map((address) => (
                        <Badge key={address.addressId}>
                          {address.addressName}
                        </Badge>
                      ))}
                    </Box>
                  </Grid.Col>
                )}
                {/* Tags */}
                <Grid.Col span={12}>
                  <Box>
                    <Text weight="600">Tags:</Text>
                    {order.serviceListing.tags.map((tag) => (
                      <Badge key={tag.tagId}>{tag.name}</Badge>
                    ))}
                  </Box>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
          {/* <Accordion.Item value="RefundDetails">
            <Accordion.Control>
              <Text size="xl" weight={600}>
                Refund Details
              </Text>
            </Accordion.Control>
            <Accordion.Panel ml={5} mr={5}>
              Refund DEETS
            </Accordion.Panel>
          </Accordion.Item> */}
        </Accordion>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const orderId = context.params.id;
  const { data: order } = await await api.get(`/order-items/${orderId}`);
  let petOwner = null;
  let pet = null;
  if (order.booking) {
    const { data: petOwnerData } = await await api.get(
      `/users/pet-owners/${order.booking.petOwnerId}`,
    );
    petOwner = petOwnerData;
    if (order.booking.petId) {
      const { data: petData } = await await api.get(
        `/pets/${order.booking.petId}`,
      );
      pet = petData;
    }
  }
  return { props: { order, petOwner, pet } };
}
