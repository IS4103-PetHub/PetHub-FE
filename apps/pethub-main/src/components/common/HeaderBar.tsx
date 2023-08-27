import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger,
  rem,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronDown } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { LoginModal } from "@/modals/LoginModal";

const HEADER_HEIGHT = rem(80);

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.dark[7],
    padding: "0 30px",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colors.gray[0],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.dark[4],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

const links: {
  link: string;
  label: string;
  links: { link: string; label: string }[] | undefined;
}[] = [
  {
    link: "/services",
    label: "Explore services",
    links: [
      {
        link: "/services/boarding",
        label: "Pet boarding",
      },
      {
        link: "/services/grooming",
        label: "Pet grooming",
      },
      {
        link: "/services/sitting",
        label: "Pet sitting",
      },
      {
        link: "/services/training",
        label: "Pet training",
      },
      {
        link: "/services/taxi",
        label: "Pet taxi",
      },
    ],
  },
  {
    link: "/services/vet",
    label: "Find a vet",
    links: undefined,
  },
  {
    link: "/services/fnb",
    label: "Dine with pets",
    links: undefined,
  },
];

const HeaderBar = () => {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [isLoginModalOpened, { open, close }] = useDisclosure(false);
  const { data: session, status } = useSession();
  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={rem(12)} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="white"
          />
          <Text size="xl" weight={600} color="white">
            PetHub
          </Text>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group position="right">
          {session ? (
            <Button
              size="md"
              radius="md"
              onClick={() => {
                notifications.show({
                  message: "Logging you out...",
                  color: "blue",
                  loading: true,
                });
                signOut({
                  callbackUrl: "/",
                });
              }}
            >
              log out
            </Button>
          ) : (
            <>
              <Button size="md" radius="md" variant="default" onClick={open}>
                Log in
              </Button>
              <Button size="md" radius="md">
                Sign up
              </Button>
            </>
          )}
        </Group>
      </Container>
      <LoginModal opened={isLoginModalOpened} open={open} close={close} />
    </Header>
  );
};

export default HeaderBar;
