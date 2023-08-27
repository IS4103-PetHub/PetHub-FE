import {
  Box,
  Button,
  Container,
  Grid,
  PasswordInput,
  SegmentedControl,
  TextInput,
  Text,
  useMantineTheme,
  Center,
} from "@mantine/core";
import { useForm, isEmail, hasLength, isNotEmpty } from "@mantine/form";
import {
  IconBuildingStore,
  IconPawFilled,
  IconPlus,
} from "@tabler/icons-react";
import React from "react";
import { PageTitle } from "web-ui";

export default function SignUp() {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      accountType: "PET_OWNER",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validate: {
      firstName: isNotEmpty("First name is required."),
      lastName: isNotEmpty("Last name is required."),
      email: isEmail("Invalid email."),
      password: hasLength(
        { min: 8 },
        "Password must be at least 8 characters long.",
      ),
    },
  });

  return (
    <Container>
      <Box mt="lg">
        <PageTitle title="🐕 Join the PetHub community" />
        <form onSubmit={form.onSubmit(console.log)}>
          <Grid mt="md" mb="md">
            <Grid.Col span={12}>
              <SegmentedControl
                color="dark"
                fullWidth
                size="md"
                data={[
                  {
                    value: "PET_OWNER",
                    label: (
                      <Center>
                        <IconPawFilled size="1rem" />
                        <Box ml={10}>Pet Owner</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "PET_BUSINESS",
                    label: (
                      <Center>
                        <IconBuildingStore size="1rem" />
                        <Box ml={10}>Pet Business</Box>
                      </Center>
                    ),
                  },
                ]}
                {...form.getInputProps("accountType")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="First name"
                withAsterisk
                placeholder="First name"
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last name"
                placeholder="Last name"
                withAsterisk
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                placeholder="email@email.com"
                withAsterisk
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput
                placeholder="Password"
                label="Password"
                withAsterisk
                {...form.getInputProps("password")}
              />
            </Grid.Col>
          </Grid>
          <Button type="submit" fullWidth leftIcon={<IconPlus size="1rem" />}>
            Create account
          </Button>
        </form>
      </Box>
    </Container>
  );
}
