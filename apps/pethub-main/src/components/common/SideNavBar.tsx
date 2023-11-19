import {
  createStyles,
  Navbar,
  Group,
  getStylesRef,
  rem,
  Text,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBoxMultiple,
  IconUser,
  IconArticle,
  IconHome2,
  IconCalendar,
  IconLogout,
  IconFileInvoice,
  IconReportAnalytics,
  IconCreditCard,
  IconHelp,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AccountStatusEnum } from "shared-utils";
import api from "@/api/axiosConfig";
import { PetBusiness } from "@/types/types";

const useStyles = createStyles((theme) => ({
  nav: {
    backgroundColor: theme.colors.dark[5],
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colors.dark[4]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colors.dark[4]}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.dark[1],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.dark[6],
      color: theme.colors.gray[0],

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colors.gray[0],
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.colors.dark[2],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: "rgba(76, 110, 245, 0.15)",
      color: theme.colors.indigo[2],
      [`& .${getStylesRef("icon")}`]: {
        color: theme.colors.indigo[2],
      },
    },
  },
}));

const defaultLinks = [
  {
    link: "/business/dashboard",
    label: "Dashboard",
    icon: IconHome2,
  },
  {
    link: "/business/application",
    label: "Business Partner Application",
    icon: IconArticle,
  },
  {
    link: "/business/account",
    label: "My Account",
    icon: IconUser,
  },
];

// display these only if PB account is not pending
const nonPendingLinks = [
  {
    link: "/business/orders",
    label: "Orders",
    icon: IconFileInvoice,
  },
  {
    link: "/business/listings",
    label: "Service Listings",
    icon: IconBoxMultiple,
  },
  {
    link: "/business/appointments",
    label: "Appointments",
    icon: IconCalendar,
  },
  {
    link: "/business/sales/dashboard",
    label: "Business Sales",
    icon: IconReportAnalytics,
  },
  {
    link: "/business/refunds",
    label: "Refunds",
    icon: IconCreditCard,
  },
  {
    link: "/business/support",
    label: "Support",
    icon: IconHelp,
  },
];

const SideNavBar = () => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const router = useRouter();
  const [active, setActive] = useState(router.asPath);
  const { data: session, status } = useSession();
  const [linksToRender, setLinksToRender] = useState<any[]>(defaultLinks);

  const checkStatusAndAddLinks = async () => {
    const session = await getSession();
    const accountStatus = session.user["accountStatus"];
    const userId = session.user["userId"];

    const petBusiness = (await (
      await api.get(`/users/pet-businesses/${userId}`)
    ).data) as PetBusiness;

    const canView =
      accountStatus !== AccountStatusEnum.Pending &&
      petBusiness.petBusinessApplication;

    if (canView) {
      const newLinks = [...defaultLinks, ...nonPendingLinks];
      setLinksToRender(newLinks);
    }
    return;
  };

  useEffect(() => {
    checkStatusAndAddLinks();
  }, []);

  const links = linksToRender.map((item) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: router.asPath === item.link,
      })}
      href={item.link}
      key={item.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
        router.push(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <Navbar
      height="100vh"
      width={{ sm: 180, md: 300 }}
      p="md"
      className={classes.nav}
    >
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Text
            size="lg"
            weight={600}
            color={theme.colors.gray[0]}
            onClick={() => router.push("/")}
          >
            PetHub Business
          </Text>
        </Group>
        {links}
      </Navbar.Section>
      {session && (
        <Button
          uppercase
          leftIcon={<IconLogout size="1.25rem" />}
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
          Logout
        </Button>
      )}
    </Navbar>
  );
};

export default SideNavBar;
