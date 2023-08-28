import "@/styles/globals.css";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
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
import { useState } from "react";
import HeaderBar from "@/components/common/HeaderBar";
import SideNavBar from "@/components/common/SideNavBar";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
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
            spacing: {
              xl: "100px",
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Notifications />
              <SessionProvider session={pageProps.session}>
                <AppShell
                  header={<HeaderBar />}
                  navbar={<SideNavBar />}
                  padding={0}
                >
                  <Component {...pageProps} />
                </AppShell>
              </SessionProvider>
            </Hydrate>
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
