import { Layout, CategoryWidget } from "@components/common";
import { Grid, Marquee, Hero } from "@components/ui";
import { ProductCard } from "@components/product";
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { getConfig } from "@framework/api";
import getAllProducts from "@framework/product/get-all-products";
import getSiteInfo from "@framework/common/get-site-info";
import getAllPages from "@framework/common/get-all-pages";
import Image from "next/image";
import { relative } from "node:path";

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale });

  const { products } = await getAllProducts({
    variables: { first: 12 },
    config,
    preview,
  });

  const { categories, brands } = await getSiteInfo({ config, preview });
  const { pages } = await getAllPages({ config, preview });

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 14400,
  };
}

export default function Home({
  products,
  brands,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <div
        className="bg-violet textured"
        style={{
          width: "100%",
          height: "1080px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <Image
          src="/sitting.jpg"
          width="1920px"
          height="1080px"
          layout="intrinsic"
        /> */}
      </div>
      {/* <Grid>
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid> */}
      <Marquee variant="secondary">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="slim"
            imgProps={{
              width: 320,
              height: 320,
            }}
          />
        ))}
      </Marquee>
      <div
        style={{
          width: "100%",
          position: "relative",
          height: "1440px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          overflow: "hidden",
        }}
        className={"textured"}
      >
        <div style={{ position: "relative", left: "25%" }}>
          <CategoryWidget image="/mens-cover.jpg" direction="left" />
        </div>
        <div style={{ position: "relative", left: "45%" }}>
          <CategoryWidget image="/womens-cover.jpg" direction="right" />
        </div>
      </div>

      {/* <Hero
        headline="Release Details: The Yeezy BOOST 350 V2 ‘Natural'"
        description="
        The Yeezy BOOST 350 V2 lineup continues to grow. We recently had the
        ‘Carbon’ iteration, and now release details have been locked in for
        this ‘Natural’ joint. Revealed by Yeezy Mafia earlier this year, the
        shoe was originally called ‘Abez’, which translated to ‘Tin’ in
        Hebrew. It’s now undergone a name change, and will be referred to as
        ‘Natural’."
      /> */}
      <Grid layout="B">
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee>
        {products.slice(0, 3).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="slim"
            imgProps={{
              width: 320,
              height: 320,
            }}
          />
        ))}
      </Marquee>
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  );
}

Home.Layout = Layout;
