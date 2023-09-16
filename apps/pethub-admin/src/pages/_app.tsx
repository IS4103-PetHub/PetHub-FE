import "@/styles/globals.css";

import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Loader,
  Container,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Inter } from "next/font/google";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import SideNavBar from "@/components/common/SideNavBar";
import type { AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"] });

export function App({ Component, pageProps }: AppProps) {
  const { data: session, status } = useSession();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
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

  return (
    <>
      <Head>
        <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily};
          }
        `}</style>
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
              <>
                <AppShell
                  navbar={session ? <SideNavBar /> : undefined}
                  padding="lg"
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
                      <Loader size="3rem" />
                    </Container>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </AppShell>
              </>
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
