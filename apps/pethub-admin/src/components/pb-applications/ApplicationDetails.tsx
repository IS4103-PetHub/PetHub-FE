import {
  Container,
  Group,
  Center,
  Accordion,
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
import { formatStringToLetterCase } from "shared-utils";
import AddressSidewaysScrollThing from "web-ui/shared/pb-applications/AddressSidewaysScrollThing";
import { BusinessApplicationStatusEnum } from "@/types/constants";
import { PetBusinessApplication } from "@/types/types";
import ApplicationStatusAlert from "./ApplicationStatusAlert";

interface ApplicationDetailsProps {
  applicationStatus: string | undefined;
  application: PetBusinessApplication | undefined;
  actionButtonGroup: any;
  disabled?: boolean;
}

export default function ApplicationDetails({
  applicationStatus,
  application,
  actionButtonGroup,
  disabled,
}: ApplicationDetailsProps) {
  if (!applicationStatus || !application) {
    return null;
  }

  const OPEN_FOREVER = [
    "userDetails",
    "applicationDetails",
    "addresses",
    "description",
    "action",
  ];

  return (
    <Container mt="50px" mb="xl">
      <ApplicationStatusAlert applicationStatus={applicationStatus} />
      <Accordion
        multiple
        variant="separated"
        value={OPEN_FOREVER}
        onChange={() => {}}
        chevronSize={0}
      >
        <Accordion.Item value="userDetails">
          <Accordion.Control
            icon={<IconUserExclamation size={rem(20)} color="blue" />}
          >
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
          <Accordion.Control icon={<IconArticle size={rem(20)} color="blue" />}>
            Application details
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <Stack>
              <Group position="apart">
                <Text fw={700}>Business type</Text>
                <Text>
                  {formatStringToLetterCase(application.businessType)}
                </Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Business email</Text>
                <Text>{application.businessEmail}</Text>
              </Group>
              <Group position="apart">
                <Text fw={700}>Website URL</Text>
                <Text>
                  {application.websiteURL ? application.websiteURL : "-"}
                </Text>
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
          <Accordion.Control
            icon={<IconFileDescription size={rem(20)} color="blue" />}
          >
            Description
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            <Textarea
              minRows={5}
              maxRows={8}
              value={application.businessDescription}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="addresses">
          <Accordion.Control
            icon={<IconAddressBook size={rem(20)} color="blue" />}
          >
            Addresses
          </Accordion.Control>
          <Accordion.Panel mr="xl" ml="md">
            {application.businessAddresses.length === 0 ? (
              <Center>
                <Text color="dimmed" mb="md">
                  No addresses provided
                </Text>
              </Center>
            ) : (
              <AddressSidewaysScrollThing
                addressList={application.businessAddresses}
                isDisabled={true}
                hasAddCard={false}
              />
            )}
          </Accordion.Panel>
        </Accordion.Item>

        {!disabled &&
          applicationStatus === BusinessApplicationStatusEnum.Pending && (
            <Accordion.Item value="action">
              <Accordion.Control
                icon={<IconAddressBook size={rem(20)} color="blue" />}
              >
                Action
              </Accordion.Control>
              <Accordion.Panel mr="xl" ml="md">
                {actionButtonGroup}
              </Accordion.Panel>
            </Accordion.Item>
          )}
      </Accordion>
    </Container>
  );
}
