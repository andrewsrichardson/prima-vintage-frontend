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
  const rows = Array.from(Array(30).keys());
  return (
    <>
      <div
        className="bg-violet textured"
        style={{
          width: "100%",
          height: "1080px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className="hidden md:block"
          style={{
            borderRight: "24px solid #38559c",
            width: "15%",
            overflow: "hidden",
          }}
        >
          {rows.map((i) => (
            <h2
              key={"prima-" + i}
              style={{
                position: "relative",
                right: Math.random() * 30,
                textAlign: "right",
              }}
              className="text-7xl italic"
            >
              PRIMA
            </h2>
          ))}
        </div>{" "}
        <div
          className="hidden md:block"
          style={{
            borderLeft: "24px solid #38559c",
            width: "15%",
            overflow: "hidden",
          }}
        >
          {rows.map((i) => (
            <h2
              key={"prima-" + i}
              style={{ position: "relative", left: Math.random() * 30 }}
              className="text-7xl italic"
            >
              VINTAGE
            </h2>
          ))}
        </div>
        {/* <Image
          src="/sitting.jpg"
          width="1920px"
          height="1080px"
          layout="intrinsic"
        /> */}
      </div>
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
        <div className={"relative md:inset-x-1/2"}>
          <CategoryWidget
            image="/mens-cover.jpg"
            direction="left"
            path={"/search?sort=latest-desc"}
          />
        </div>
        <div className={"relative md:inset-x-1/2"}>
          <CategoryWidget
            image="/womens-cover.jpg"
            direction="right"
            path={"/search/prima-collection"}
          />
        </div>
      </div>

      <Hero
        headline="Sustainable garms. Affordable Prices."
        description="
        Prima Vintage is committed to bringing the retro clothing community the freshest ethically-sourced garms. "
      />
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
