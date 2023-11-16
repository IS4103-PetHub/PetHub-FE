import {
  Accordion,
  Box,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Image,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageTitle } from "web-ui";

export default function Help({}) {
  const theme = useMantineTheme();
  const router = useRouter();

  // TODO: need to refine the answers
  const pofaqList = [
    {
      id: "1",
      key: "password",
      question: "How do i change my password?",
      answer: (
        <Text>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/customer/account">
              <Text color="blue">My Account</Text>
            </Link>
          </span>{" "}
          and select the &quot;Change password&quot; tab.
        </Text>
      ),
    },
    {
      id: "2",
      key: "booking",
      question: "How do I book services for my pet?",
      answer:
        "To book services for your pet, navigate to the 'Service Listings' section in the app. Browse through the available services offered by trusted pet businesses, select the desired service, and follow the booking instructions provided by the business.",
    },
    {
      id: "3",
      key: "reviews",
      question: "Can I see reviews of pet businesses before booking?",
      answer:
        "Yes, you can! We encourage pet owners to share their experiences by leaving reviews for pet businesses. You can find reviews on each business's profile page. These reviews can help you make informed decisions when choosing services for your pet.",
    },
    {
      id: "4",
      key: "cancellations",
      question: "What should I do if I need to cancel a booking?",
      answer:
        "If you need to cancel a booking, go to the 'My Bookings' section. Locate the booking you wish to cancel and follow the provided instructions. Keep in mind that cancellation policies may vary between businesses, so it's advisable to review the terms before booking.",
    },
    {
      id: "5",
      key: "payments",
      question: "How do payments work for pet services?",
      answer:
        "Payments for pet services are handled securely through the app. After booking a service, you can make payments using the available payment options. Make sure to check the business's payment policies and accepted methods before confirming your booking.",
    },
    {
      id: "6",
      key: "vet-consultation",
      question: "Can I schedule a virtual vet consultation for my pet?",
      answer:
        "Yes, you can schedule virtual vet consultations through the app. Navigate to the 'Vet Services' section, choose a vet, and follow the steps to book a virtual consultation. Ensure you provide all necessary information about your pet's health for a comprehensive session.",
    },
    {
      id: "7",
      key: "grooming-options",
      question: "What grooming options are available for my pet?",
      answer:
        "Our platform offers a variety of grooming services for your pet, including bathing, grooming, and styling. Explore the 'Grooming' section to discover grooming options provided by skilled professionals. You can customize services based on your pet's specific needs.",
    },
  ];

  const pbfaqList = [
    {
      id: "1",
      key: "registration",
      question: "How do I register my pet business on PetHub?",
      answer:
        "To register your pet business on PetHub, go to the 'Business Registration' page and follow the step-by-step process. Provide accurate information about your business, including services offered, business type, and contact details. Once submitted, our team will review your application.",
    },
    {
      id: "2",
      key: "service-listings",
      question: "How can I list my services on PetHub?",
      answer:
        "After your business registration is approved, you can easily list your services through the 'Manage Services' dashboard. Add detailed descriptions, pricing, and availability for each service. Keep your service listings updated to attract more pet owners.",
    },
    {
      id: "3",
      key: "appointment-system",
      question: "Does PetHub provide an appointment and scheduling system?",
      answer:
        "Yes, PetHub comes with a built-in appointment and scheduling system. Pet owners can book your services and schedule appointments seamlessly through the app. You'll receive notifications and reminders for upcoming appointments to manage your schedule efficiently.",
    },
    {
      id: "4",
      key: "account-updates",
      question: "How can I update my business information on PetHub?",
      answer:
        "To update your business information, log in to your PetHub account and navigate to the 'Business Dashboard.' From there, you can edit and update your business details, including contact information, service offerings, and business hours.",
    },
    {
      id: "5",
      key: "customer-reviews",
      question: "How do customer reviews work on PetHub?",
      answer:
        "Pet owners can leave reviews for your business based on their experiences. Positive reviews can boost your business's reputation. Responding to reviews, whether positive or negative, is encouraged to engage with your customers and address any concerns.",
    },
    {
      id: "6",
      key: "payment-process",
      question:
        "What is the payment process for services booked through PetHub?",
      answer:
        "PetHub provides a secure payment process for services booked through the platform. Payments are typically processed online, and you'll receive the funds directly to your registered business account. Make sure your payment details are up-to-date in the 'Payment Settings' section.",
    },
  ];

  const generatePOFAQ = (
    <>
      {pofaqList.map((item) => (
        <Accordion.Item key={item.id} value={item.key}>
          <Accordion.Control>
            <Text>{item.question}</Text>
          </Accordion.Control>
          <Accordion.Panel>{item.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </>
  );

  const generatePBFAQ = (
    <>
      {pbfaqList.map((item) => (
        <Accordion.Item key={item.id} value={item.key}>
          <Accordion.Control>
            <Text>{item.question}</Text>
          </Accordion.Control>
          <Accordion.Panel>{item.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </>
  );

  return (
    <>
      <Head>
        <title>Help - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box bg={theme.colors.yellow[1]} h="45%">
        <PageTitle align="center" title="Why PetHub" color="dark" mb={30} />
        <Center mb={50} ml={50} mr={50}>
          <Box>
            <Text align="center" size={"xl"} weight={800} mb={30}>
              Pet Owners
            </Text>
            <Grid>
              <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Center mb="xs" mt="xs">
                    <Image
                      src="/help-search.svg"
                      width={85}
                      alt="Search Icon"
                    />
                  </Center>
                  <Text weight={800}>Discover Pet Services</Text>
                  <Divider mb="md" />
                  <Text>
                    Explore service listings of trusted pet businesses with
                    transparent user reviews. Received personalised
                    recommendations based on your pet and past orders.
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Center>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Center mb="xs" mt="xs">
                      <Image
                        src="/help-calendar.svg"
                        width={85}
                        alt="Search Icon"
                      />
                    </Center>
                    <Text weight={800}>Book & Manage Appointments</Text>
                    <Divider mb="md" />
                    <Text>
                      Seemlessly book, reschedule and manage your appointments
                      with pet businesses on PetHub for all of your furry
                      friends&apos; needs from grooming to vet visits.
                    </Text>
                  </Card>
                </Center>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Center mb="xs" mt="xs">
                    <Image
                      src="/help-points.svg"
                      width={85}
                      alt="Search Icon"
                    />
                  </Center>
                  <Text weight={800}>Checkout & Earn Points</Text>
                  <Divider mb="md" />
                  <Text>
                    Enjoy a secure and fuss free checkout with stripe payment
                    gateway and accumulate points with each dollar spent on
                    PetHub to offset future purchases!
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Center>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Center mb="xs" mt="xs">
                      <Image src="/help-dog.svg" width={85} alt="Search Icon" />
                    </Center>
                    <Text weight={800}>Find & Reunite Missing Pets</Text>
                    <Divider mb="md" />
                    <Text>
                      Did your cat go missing? Or did a random parrot fly into
                      your house? Simply post on PetHub&apos;s Pet Lost and
                      Found Board to find your pet or the pet owner!
                    </Text>
                  </Card>
                </Center>
              </Grid.Col>
            </Grid>
          </Box>
        </Center>
        <Center mb={50} ml={50} mr={50}>
          <Box>
            <Text align="center" size={"xl"} weight={800} mb={30}>
              Pet Businesses
            </Text>
            <Grid>
              <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Center mb="xs" mt="xs">
                    <Image src="/help-list.svg" width={85} alt="Search Icon" />
                  </Center>
                  <Text weight={800}>Manage Listings, Orders & Refunds</Text>
                  <Divider mb="md" />
                  <Text>
                    Customise serivce listings to your business needs. Receive
                    an auto-generated invoice for every order. Review and
                    approve refunds on a case-by-case basis.
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Center>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Center mb="xs" mt="xs">
                      <Image
                        src="/help-event.svg"
                        width={85}
                        alt="Search Icon"
                      />
                    </Center>
                    <Text weight={800}>Manage Schedule & Appointments</Text>
                    <Divider mb="md" />
                    <Text>
                      Customise your business availability with weekly/daily
                      rules, set time period vacancies and manage customer
                      appointments from start to end all in one platform.
                    </Text>
                  </Card>
                </Center>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Center mb="xs" mt="xs">
                    <Image
                      src="/help-report.svg"
                      width={85}
                      alt="Search Icon"
                    />
                  </Center>
                  <Text weight={800}>Receive Monthly Payouts</Text>
                  <Divider mb="md" />
                  <Text>
                    Enjoy a low commission rate and receive monthly payouts of
                    your service listings sales. Sell more with PetHub to enjoy
                    even lower commission rates.
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Center>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Center mb="xs" mt="xs">
                      <Image
                        src="/help-chart.svg"
                        width={85}
                        alt="Search Icon"
                      />
                    </Center>
                    <Text weight={800}>Obtain Business Insights</Text>
                    <Divider mb="md" />
                    <Text>
                      View statistics and data visualisations regarding your
                      service listings&apos; performance, monthly sales and
                      projected sales via the business sales dashboard.
                    </Text>
                  </Card>
                </Center>
              </Grid.Col>
            </Grid>
          </Box>
        </Center>
      </Box>
      <Container fluid>
        <Container fluid pt={50} pb={50} w="90%">
          <PageTitle align="center" title="Frequently Asked Questions" />
          <Accordion
            multiple
            value={["POFAQ", "PBFAQ"]}
            variant="contained"
            chevronSize={0}
            mt="md"
          >
            <Accordion.Item value="POFAQ">
              <Accordion.Control>
                <Text size={"xl"} weight={800}>
                  Pet Owners
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion variant="contained" chevronSize={0} mt="md">
                  {generatePOFAQ}
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="PBFAQ">
              <Accordion.Control>
                <Text size={"xl"} weight={800}>
                  Pet Businesses
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion variant="contained" chevronSize={0} mt="md">
                  {generatePBFAQ}
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Container>
    </>
  );
}
