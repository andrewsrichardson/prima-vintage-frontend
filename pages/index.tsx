import { Layout, CategoryWidget } from "@components/common";
import { Grid, Marquee, Hero, Logo } from "@components/ui";
import { ProductCard } from "@components/product";
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { getConfig } from "@framework/api";
import getAllProducts from "@framework/product/get-all-products";
import getSiteInfo from "@framework/common/get-site-info";
import getAllPages from "@framework/common/get-all-pages";
import Image from "next/image";
import { relative } from "node:path";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";
import { useEffect } from "react";
import { useCustomer } from "@framework/customer";

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
  const rows = Array.from(Array(15).keys());
  const sendDataToGTM = useGTMDispatch();
  const { data: customer } = useCustomer();

  useEffect(() => {
    sendDataToGTM({
      event: "productImpression",
      ecommerce: {
        impressions: products.slice(0, 3).map((product, index) => {
          return {
            list: "Home Marquee",
            brand: product.vendor,
            category: product.productType,
            currency: product.price?.currencyCode,
            dimension6: product.tags[0] || null,
            dimension7: "",
            dimension8: "",
            dimension9: true,
            id: product.id,
            name: product.name,
            price: product.price.value,
            quantity: "1",
            position: index,
            url: "https://www.primavintage.co.uk/",
          };
        }),
      },
    });
  }, []);

  useEffect(() => {
    sendDataToGTM({
      event: "pageMetaData",
      page: {
        category1: null,
        category2: null,
        category3: null,
        type: "home",
      },
      user: {
        email: customer?.email,
        hasTransacted: "unknown",
        // @ts-ignore
        id: customer?.id,
        loggedIn: customer ? true : false,
      },
    });
  }, []);

  const handleProductClick = (product) => {
    sendDataToGTM({
      event: "productClick",
      ecommerce: {
        currencyCode: "GBP",
        click: {
          actionField: {
            list: "Home Marquee",
          },
          products: [
            {
              brand: product.vendor,
              category: product.productType,
              currency: product.price?.currencyCode,
              dimension6: "",
              dimension7: "",
              dimension8: "",
              dimension9: true,
              id: product.id,
              name: product.name,
              price: product.price.value,
              quantity: "1",
              url: "https://www.primavintage.co.uk/product" + product.path,
            },
          ],
        },
      },
    });
  };

  return (
    <>
      {" "}
      <Marquee variant="primary">
        <h2 className="uppercase whitespace-nowrap text-black">
          Quality Clothes
        </h2>
        <div className="max-w-xs max-h-xs capitalize">
          <Logo height="36px" width="36px" />
        </div>
        <h2 className="uppercase whitespace-nowrap text-black">
          Free Delivery over £50
        </h2>
        <div className="max-w-xs max-h-xs capitalize">
          <Logo height="36px" width="36px" />
        </div>
        <h2 className="uppercase whitespace-nowrap text-black">
          Sustainably Sourced
        </h2>
        <div className="max-w-xs max-h-xs capitalize">
          <Logo height="36px" width="36px" />
        </div>
      </Marquee>
      <div
        className="bg-violet textured relative"
        style={{
          width: "100%",
          height: "90vh",
          maxHeight: "1080px",
          overflow: "hidden",
        }}
      >
        <h2
          className="uppercase absolute italic left-2/3"
          style={{ left: "60%", top: "75%" }}
        >
          Fresh Vintage clothing. <br /> Hand-Picked.
          <br /> Sustainably Sourced.
        </h2>
        <div
          className="checked absolute"
          style={{
            width: "50%",
            height: "20vh",
            maxHeight: "1080px",
            position: "absolute",
            bottom: "5%",
            left: "5%",
          }}
        ></div>
        <div
          className="flex w-1/4 justify-center absolute"
          style={{ left: "5%", top: "5%" }}
        >
          <div className="w-full h-full absolute opacity-30 pointer-events-none z-10">
            <Image
              src="/dc-distressed-bg-1.jpg"
              layout="fill"
              className="rounded-full"
            />
          </div>
          <Logo width="256px" height="256px" />
        </div>
        <div
          className="checked-large absolute overlay"
          style={{
            width: "40%",
            height: "60vh",
            maxHeight: "1080px",
            position: "absolute",
            bottom: "30%",
            left: "60%",
          }}
        ></div>
        <div
          className="bottom-1/2 md:bottom-5 md:w-1/2"
          style={{
            maxHeight: "1080px",
            position: "absolute",
            left: "5%",
          }}
        >
          <div className="w-full h-full absolute opacity-30 pointer-events-none z-10">
            <Image src="/dc-distressed-bg-1.jpg" layout="fill" />
          </div>
          <Image
            src="/rooftop-andrew-brushed.jpg"
            width="1920px"
            height="1080px"
            priority
            objectFit="cover"
            objectPosition="top"
            layout="intrinsic"
          />
        </div>
        <div
          className="hidden md:block md:w-content md:h-1/5 lg:h-full lg:w-1/5 xl:w-1/6 z-10 bg-violet textured"
          style={{
            overflow: "hidden",
            position: "absolute",
            right: "1%",
          }}
        >
          {rows.map((i) => (
            <h2
              key={"prima-" + i}
              style={{ left: Math.random() * 30, lineHeight: "4.5rem" }}
              className="text-8xl italic relative"
            >
              PRIMA
            </h2>
          ))}
        </div>{" "}
      </div>
      <Marquee variant="secondary">
        {products.slice(0, 3).map((product, i) => (
          <div onClick={() => handleProductClick(product)}>
            <ProductCard
              key={product.id}
              product={product}
              variant="slim"
              imgProps={{
                width: 320,
                height: 320,
              }}
            />
          </div>
        ))}
      </Marquee>
      <div
        style={{
          width: "100%",
          position: "relative",
          height: "150vh",
          maxHeight: "1440px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          overflow: "hidden",
        }}
        className={"textured bg-violet h-screen"}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            filter: "blur(3px)",
          }}
        >
          <Image
            src="/retro-grid-purple.png"
            height="748px"
            width="1920px"
            layout="responsive"
            className="absolute"
          />
        </div>
        <div className={"relative m-auto"}>
          <CategoryWidget
            image="/rooftop-george-brushed.jpg"
            direction="left"
            path={"/search?sort=latest-desc"}
          />
        </div>
        <div className={"relative m-auto"}>
          <CategoryWidget
            image="/front-jaina-brushed.jpg"
            direction="right"
            path={"/search/prima-collection"}
          />
        </div>
      </div>
      <Hero
        headline="Sustainable garms. Affordable Prices."
        description="Prima Vintage is committed to bringing the retro clothing community the freshest ethically-sourced garms. "
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
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  );
}

Home.Layout = Layout;
