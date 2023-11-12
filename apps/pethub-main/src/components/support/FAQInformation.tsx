import { Accordion, Box, Card, Text } from "@mantine/core";
import Link from "next/link";

export default function FAQInformation({}) {
  const faqList = [
    {
      id: "1",
      key: "password",
      question: "How do i change my password?",
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
      question: "How can I update my contact information on the platform?",
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
      question: "How do i temporarily disable my service listings?",
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
      question: "How does the calendar group works?",
      answer: (
        <>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/appointments">
              <Text color="blue">Appointments</Text>
            </Link>
          </span>{" "}
          select &quot;Create Calendar Group&quot; to view the rules set for
          using a calendar group.
        </>
      ),
    },
    {
      id: "4",
      key: "businessSales",
      question:
        "Is there a way to track the performance of my service listings?",
      answer: (
        <>
          Navigate to{" "}
          <span style={{ display: "inline-block" }}>
            <Link href="/business/sales/dashboard">
              <Text color="blue">Business Sales</Text>
            </Link>
          </span>{" "}
          to monitor the performance of your service listings through the
          analytics dashboard
        </>
      ),
    },
  ];

  const generateFAQ = (
    <>
      {faqList.map((item) => (
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
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xl">Frequently Asked Questions</Text>
      <Accordion variant="contained" chevronSize={0} mt="md">
        {generateFAQ}
      </Accordion>
    </Card>
  );
}
