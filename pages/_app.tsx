import "@assets/main.css";
import "@assets/chrome-bug.css";
import "keen-slider/keen-slider.min.css";

import { FC, useEffect } from "react";
import { Head } from "@components/common";
import { ManagedUIContext } from "@components/ui/context";
import Transition from "@components/ui/Transition";
import { useRouter } from "next/router";
import { GTMProvider } from "@elgorditosalsero/react-gtm-hook";

const Noop: FC = ({ children }) => <>{children}</>;

export default function MyApp({ Component, pageProps }) {
  const Layout = (Component as any).Layout || Noop;

  const router = useRouter();
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  const gtmParams = { id: "GTM-PQNQ3VW" };

  return (
    <GTMProvider state={gtmParams}>
      <Head />
      <ManagedUIContext>
        <Transition location={router.pathname}>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Transition>
      </ManagedUIContext>
    </GTMProvider>
  );
}
