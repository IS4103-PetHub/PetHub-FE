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
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { LoginModal } from "../login/LoginModal";
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
    link: "/service-listings",
    label: "Explore services",
    links: [
      {
        link: "/service-listings/boarding",
        label: "Pet boarding",
      },
      {
        link: "/service-listings/grooming",
        label: "Pet grooming",
      },
      {
        link: "/service-listings/vet",
        label: "Veterinary",
      },
      {
        link: "/service-listings/dining",
        label: "Dining",
      },
      {
        link: "/service-listings/retail",
        label: "Pet retail",
      },
    ],
  },
  {
    link: "/lost-and-found",
    label: "Lost & found pets",
    links: undefined,
  },
  {
    link: "/help",
    label: "Help",
    links: undefined,
  },
  {
    link: "/customer/account",
    label: "My account",
    links: undefined,
  },
];

const HeaderBar = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  const [isLoginModalOpened, { open, close }] = useDisclosure(false);
  const { data: session, status } = useSession();

  const items = links.map((link) => {
    // Only logged in users can see the account tab
    if (link.label === "My account") {
      if (!session) {
        return null;
      }
    }

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
            <Link href={link.link} className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={rem(12)} stroke={1.5} />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </Link>
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
          <Image
            src="pethub-logo-white.png"
            height={30}
            mt={-5}
            onClick={() => router.push("/")}
          />
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
              Log out
            </Button>
          ) : (
            <>
              <Button size="md" radius="md" variant="default" onClick={open}>
                Log in
              </Button>
              <Button
                size="md"
                radius="md"
                onClick={() => router.push("/signup")}
              >
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
