import {
  Accordion,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBuildingStore, IconUser } from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { AccountTypeEnum } from "shared-utils";
import { PageTitle } from "web-ui";
import BusinessValueCard from "@/components/support/BusinessValueCard";

const PO_FAQ_LIST = [
  {
    id: "1",
    key: "password",
    question: "How do I change my password?",
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

const PB_FAQ_LIST = [
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
    question: "How do I list my services on PetHub?",
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
    question: "How do I update my business information on PetHub?",
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
    question: "What is the payment process for services booked through PetHub?",
    answer:
      "PetHub provides a secure payment process via Stripe for services booked through the platform. Payments are typically processed online, and you'll receive the funds directly to your registered business account. Make sure your payment details are up-to-date in the 'Payment Settings' section.",
  },
];

const PO_BUSINESS_VALUE = [
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/search-in-list.png",
    imageAltText: "Search Icon",
    title: "Discover Pet Services",
    description:
      "Explore service listings of trusted pet businesses with transparent user reviews. Received personalised recommendations based on your pet and past orders.",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/property-time.png",
    imageAltText: "Calendar Icon",
    title: "Book & Manage Appointments",
    description:
      "Seemlessly book, reschedule and manage your appointments with pet businesses on PetHub for all of your furry friends' needs from grooming to vet visits.",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/buy-for-change.png",
    imageAltText: "Points Icon",
    title: "Checkout & Earn Points",
    description:
      "Enjoy a secure and fuss-free checkout with Stripe payment gateway and accumulate points with each dollar spent on PetHub to offset future purchases!",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/cat.png",
    imageAltText: "Dog Icon",
    title: "Find & Reunite Missing Pets",
    description:
      "Did your cat go missing? Or did a random parrot fly into your house? Simply post on PetHub's Pet Lost and Found Board to find your pet or the pet owner!",
  },
];

const PB_BUSINESS_VALUE = [
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/delivery-settings.png",
    imageAltText: "List Icon",
    title: "Manage Listings, Orders & Refunds",
    description:
      "Customise serivce listings to your business needs. Receive an auto-generated invoice for every order. Review and approve refunds on a case-by-case basis.",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/sign-up-in-calendar.png",
    imageAltText: "Event Icon",
    title: "Manage Schedule & Appointments",
    description:
      "Customise your business availability with weekly/daily rules, set time period vacancies and manage customer appointments from start to end all in one platform.",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/request-money.png",
    imageAltText: "Payout Icon",
    title: "Receive Monthly Payouts",
    description:
      "Enjoy a low commission rate and receive monthly payouts of your service listings sales. Sell more with PetHub to enjoy even lower commission rates.",
  },
  {
    imageUrl: "https://img.icons8.com/pulsar-color/96/statistics.png",
    imageAltText: "Chart Icon",
    title: "Obtain Business Insights",
    description:
      "View statistics and data visualisations regarding your service listings' performance, monthly sales and projected sales via the business sales dashboard.",
  },
];

export default function Help({}) {
  const theme = useMantineTheme();
  const router = useRouter();

  const generateFAQSection = (faqList: any[]) => {
    return (
      <>
        {faqList.map((item) => (
          <Accordion.Item key={item.id} value={item.key}>
            <Accordion.Control>
              <Text fw={600}>{item.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>{item.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </>
    );
  };

  async function handleClickGoToSupport() {
    const session = await getSession();
    if (!session) {
      notifications.show({
        id: "support-login-required",
        title: "Login Required",
        message: `Please login to create a support ticket.`,
      });
      return;
    }
    const accountType = session.user["accountType"];
    if (session && accountType === AccountTypeEnum.PetOwner) {
      router.push("/customer/support");
    }
  }

  return (
    <>
      <Head>
        <title>Help - PetHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container bg={theme.colors.gray[1]} h="52%" fluid>
        <PageTitle
          align="center"
          title="How does PetHub work?"
          p={50}
          pb={30}
          fw={700}
          size="2.2rem"
        />
        <Container fluid w="80%" mb={50}>
          <Text align="center" size="1.5rem" weight={700} mb={30}>
            Pet Owners
          </Text>
          <Grid>
            {PO_BUSINESS_VALUE.map((item) => {
              return (
                <Grid.Col span={3} key={item.title}>
                  <BusinessValueCard
                    imageUrl={item.imageUrl}
                    imageAltText={item.imageAltText}
                    title={item.title}
                    description={item.description}
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Container>
        <Container fluid w="80%">
          <Text align="center" size="1.5rem" weight={700} mb={30}>
            Pet Businesses
          </Text>
          <Grid>
            {PB_BUSINESS_VALUE.map((item) => {
              return (
                <Grid.Col span={3} key={item.title}>
                  <BusinessValueCard
                    imageUrl={item.imageUrl}
                    imageAltText={item.imageAltText}
                    title={item.title}
                    description={item.description}
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Container>
      </Container>
      <Container fluid pt={50} pb={50} w="90%">
        <PageTitle align="center" title="Frequently Asked Questions" fw={700} />
        <Text align="center" mb="md">
          Can&apos;t find your question below? Contact our customer service by
          creating a Support Ticket!
        </Text>
        <Center>
          <Button mb="md" onClick={handleClickGoToSupport}>
            Go to Support
          </Button>
        </Center>
        <Group>
          <IconUser color={theme.colors.indigo[6]} />
          <Text size="xl" weight={800}>
            Pet Owners
          </Text>
        </Group>
        <Accordion variant="contained" mt="md" mb={50}>
          {generateFAQSection(PO_FAQ_LIST)}
        </Accordion>
        <Group>
          <IconBuildingStore color={theme.colors.indigo[6]} />
          <Text size="xl" weight={800}>
            Pet Businesses
          </Text>
        </Group>
        <Accordion variant="contained" mt="md">
          {generateFAQSection(PB_FAQ_LIST)}
        </Accordion>
      </Container>
    </>
  );
}
