import "@/styles/globals.css";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Loader,
  Container,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import HeaderBar from "@/components/common/HeaderBar";
import SideNavBar from "@/components/common/SideNavBar";
import { AccountTypeEnum } from "@/types/constants";
import type { AppProps } from "next/app";

export function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const { data: session, status } = useSession();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true
            refetchOnMount: false,
          },
        },
      }),
  );

  function headerBarCheck() {
    if (
      status === "loading" ||
      (session && session.user["accountType"] === AccountTypeEnum.PetBusiness)
    ) {
      return null;
    } else {
      return <HeaderBar />;
    }
  }

  function sideBarCheck() {
    if (
      status !== "authenticated" ||
      (session && session.user["accountType"] !== AccountTypeEnum.PetBusiness)
    ) {
      return null;
    } else {
      return <SideNavBar />;
    }
  }

  return (
    <>
      <Head>
        <style>
          @import
          url(&#39;https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap&#39;);
        </style>
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            fontFamily: "Inter, sans-serif",
            primaryColor: "indigo",
            colorScheme,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Notifications />
              <AppShell
                header={headerBarCheck()}
                navbar={sideBarCheck()}
                padding={0}
              >
                {status === "loading" ? (
                  <Container
                    style={{
                      height: "100vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Loader size="5rem" />
                  </Container>
                ) : (
                  <Component {...pageProps} />
                )}
              </AppShell>
            </Hydrate>
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default function AppProvider(props: any) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <App {...props} />
    </SessionProvider>
  );
}
