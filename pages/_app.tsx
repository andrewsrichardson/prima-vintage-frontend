import "@assets/main.css";
import "@assets/chrome-bug.css";
import "keen-slider/keen-slider.min.css";

import { FC, useEffect, useState } from "react";
import { Head } from "@components/common";
import { ManagedUIContext } from "@components/ui/context";
import Transition from "@components/ui/Transition";
import { useRouter } from "next/router";
import { GTMProvider } from "@elgorditosalsero/react-gtm-hook";

const Noop: FC = ({ children }) => <>{children}</>;

export default function MyApp({ Component, pageProps }) {
  const Layout = (Component as any).Layout || Noop;

  const [loadedImages, setLoadedImages] = useState([]);

  const router = useRouter();
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  const gtmParams = { id: "GTM-PQNQ3VW" };

  const handleLoad = (key) => {
    !loadedImages.find((i) => i === key) &&
      setLoadedImages([...loadedImages, key]);
  };

  return (
    <GTMProvider state={gtmParams}>
      <Head />
      <ManagedUIContext>
        <Transition location={router.pathname} loadedImages={loadedImages}>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} incrementLoadedImages={handleLoad} />
          </Layout>
        </Transition>
      </ManagedUIContext>
    </GTMProvider>
  );
}
