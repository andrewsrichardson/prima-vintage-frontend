import "@assets/main.css";
import "@assets/chrome-bug.css";
import "keen-slider/keen-slider.min.css";

import { FC, useEffect } from "react";
import type { AppProps } from "next/app";
import { Head } from "@components/common";
import { ManagedUIContext } from "@components/ui/context";
import Transition from "@components/ui/Transition";
import { useRouter } from "next/router";

const Noop: FC = ({ children }) => <>{children}</>;

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop;

  const router = useRouter();

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Transition location={router.pathname}>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Transition>
      </ManagedUIContext>
    </>
  );
}
