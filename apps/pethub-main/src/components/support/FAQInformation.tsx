import { Accordion, Card, Text } from "@mantine/core";
import Link from "next/link";

export default function FAQInformation({}) {
  const faqList = [
    {
      id: "1",
      key: "password",
      question: "How do I change my password?",
      answer: (
        <Text>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/account">
              <Text color="blue">My Account</Text>
            </Link>
          </span>{" "}
          and select the &quot;Change password&quot; tab.
        </Text>
      ),
    },
    {
      id: "3",
      key: "contactInformation",
      question: "How do I update my contact information on the platform?",
      answer: (
        <>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/account">
              <Text color="blue">My Account</Text>
            </Link>
          </span>{" "}
          and select &quot; Edit&quot; to update your contact details.
        </>
      ),
    },
    {
      id: "2",
      key: "serviceListing",
      question: "How do I temporarily disable my service listings?",
      answer: (
        <>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/listings">
              <Text color="blue">Service Listings</Text>
            </Link>
          </span>{" "}
          select your service listing and set the last possible date to the last
          operational date.
        </>
      ),
    },
    {
      id: "3",
      key: "calandarGroup",
      question: "How do Calendar Groups work?",
      answer: (
        <>
          Calendar Groups are for pet businesses to manage business availablity
          and schedule, such as opening hours! Use weekly recurring rules to
          configure your business&apos; standard operating schedule, and use
          daily rules to set date overrides. Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/appointments">
              <Text color="blue">Appointments</Text>
            </Link>
          </span>{" "}
          select &quot;Create Calendar Group&quot; to view the full instructions
          for creating a calendar group.
        </>
      ),
    },
    {
      id: "4",
      key: "businessSales",
      question: "How can I track the performance of my service listings?",
      answer: (
        <>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/sales/dashboard">
              <Text color="blue">Business Sales</Text>
            </Link>
          </span>{" "}
          to monitor the performance of your service listings via the analytics
          dashboard.
        </>
      ),
    },
  ];

  const generateFAQ = (
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xl">Frequently Asked Questions</Text>
      <Accordion variant="contained" chevronSize={0} mt="md">
        {generateFAQ}
      </Accordion>
    </Card>
  );
}
