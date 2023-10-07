import "@/styles/globals.css";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Loader,
  LoadingOverlay,
  Container,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  LoadingOverlayProvider,
  useLoadingOverlay,
} from "web-ui/shared/LoadingOverlayContext";
import SideNavBar from "@/components/common/SideNavBar";
import type { AppProps } from "next/app";

const inter = localFont({
  src: "../../public/Inter-VariableFont.ttf",
  variable: "--font-inter",
});

export function App({ Component, pageProps }: AppProps) {
  const { visible } = useLoadingOverlay();
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
    <main className={inter.className}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            fontFamily: "var(--font-inter)",
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
                      <Loader size="lg" opacity={0.5} />
                    </Container>
                  ) : (
                    <>
                      {visible && (
                        <LoadingOverlay
                          visible={visible}
                          zIndex={1000}
                          overlayBlur={10}
                          loaderProps={{
                            size: "md",
                            color: "indigo",
                            variant: "bars",
                          }}
                        />
                      )}
                      <Component {...pageProps} />
                    </>
                  )}
                </AppShell>
              </>
            </Hydrate>
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </main>
  );
}

export default function AppProvider(props: any) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <LoadingOverlayProvider>
        <App {...props} />
      </LoadingOverlayProvider>
    </SessionProvider>
  );
}
