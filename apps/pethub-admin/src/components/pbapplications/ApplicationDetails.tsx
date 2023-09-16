import {
  Grid,
  Container,
  Box,
  Center,
  Card,
  Group,
  Accordion,
  useMantineTheme,
  Textarea,
  rem,
  Text,
  Stack,
} from "@mantine/core";
import {
  IconUserExclamation,
  IconArticle,
  IconFileDescription,
  IconAddressBook,
} from "@tabler/icons-react";
import React from "react";
import { PetBusinessApplication } from "@/types/types";
import { formatEnum } from "../util/EnumHelper";
import { AddressSidewaysScrollThing } from "./AddressSidewaysScrollThing";
import ApplicationStatusAlert from "./ApplicationStatusAlert";

interface ApplicationDetailsProps {
  applicationStatus: string | undefined;
  application: PetBusinessApplication | undefined;
}

export default function ApplicationDetails({
  applicationStatus,
  application,
  ...props
}: ApplicationDetailsProps) {
  if (!applicationStatus || !application) {
    return null;
  }

  const OPEN_FOREVER = [
    "userDetails",
    "applicationDetails",
    "addresses",
    "description",
  ];

  return (
    <Container mt="50px" mb="xl">
      <ApplicationStatusAlert applicationStatus={applicationStatus} />
      <Accordion
        multiple
        variant="separated"
        value={OPEN_FOREVER}
        onChange={() => {}}
      >
        <Accordion.Item value="userDetails">
          <Accordion.Control icon={<IconUserExclamation size={rem(20)} />}>
            User details
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <Stack>
              <Group position="apart">
                <Text fw={700}>Pet business ID</Text>
                <Text>{application.petBusiness.userId}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Company name</Text>
                <Text>{application.petBusiness.companyName}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Contact number</Text>
                <Text>{application.petBusiness.contactNumber}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>UEN</Text>
                <Text>{application.petBusiness.uen}</Text>
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="applicationDetails">
          <Accordion.Control icon={<IconArticle size={rem(20)} />}>
            Application details
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <Stack>
              <Group position="apart">
                <Text fw={700}>Business type</Text>
                <Text>{formatEnum(application.businessType)}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Business email</Text>
                <Text>{application.businessEmail}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Application created</Text>
                <Text>
                  {new Date(application.dateCreated).toLocaleDateString()}
                </Text>
              </Group>
              {application.lastUpdated && (
                <Group position="apart">
                  <Text fw={700}>Application updated</Text>
                  <Text>
                    {new Date(application.lastUpdated).toLocaleDateString()}
                  </Text>
                </Group>
              )}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="description">
          <Accordion.Control icon={<IconFileDescription size={rem(20)} />}>
            Description
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <Textarea
              minRows={3}
              maxRows={5}
              disabled
              value={application.businessDescription}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="addresses">
          <Accordion.Control icon={<IconAddressBook size={rem(20)} />}>
            Addresses
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <AddressSidewaysScrollThing
              addressList={application.businessAddresses}
              openModal={() => {}}
              onRemoveAddress={() => {}}
              isDisabled={true}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
