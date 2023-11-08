import { Accordion, Box, Card, Text } from "@mantine/core";

export default function FAQInformation({}) {
  const faqList = [
    {
      id: "1",
      key: "password",
      question: "How do i change my password?",
      answer:
        "Please head to the accounts management and select `change password`",
    },
    {
      id: "2",
      key: "serviceListing",
      question: "How do i temporarily disable my service listings?",
      answer:
        "Please head to the servcie listing management and set the last possible date to the last operational date",
    },
    {
      id: "3",
      key: "calandarGroup",
      question: "How does the calendar group works?",
      answer: "Please use your brain",
    },
  ];

  const generateFAQ = (
    <>
      {faqList.map((item) => (
        <Accordion.Item key={item.id} value={item.key}>
          <Accordion.Control>
            <Text>{item.question}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">{item.answer}</Text>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xl">Frequently Asked Questions</Text>
      <Accordion multiple variant="filled" chevronSize={0} mt="md">
        {generateFAQ}
      </Accordion>
    </Card>
  );
}
