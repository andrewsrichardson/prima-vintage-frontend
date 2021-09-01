import cn from "classnames";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { FC, useEffect, useState } from "react";
import s from "./ProductView.module.css";

import { Swatch, ProductSlider } from "@components/product";
import { Button, Container, Text, useUI } from "@components/ui";

import type { Product } from "@commerce/types";
import usePrice from "@framework/product/use-price";
import { useAddItem } from "@framework/cart";

import { getVariant, SelectedOptions } from "../helpers";
import WishlistButton from "@components/wishlist/WishlistButton";
import Link from "next/link";
import Accordion from "@components/common/Accordion";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";
import useCart from "@framework/cart/use-cart";
import { useCustomer } from "@framework/customer";

interface Props {
  className?: string;
  children?: any;
  product: Product;
}

const ProductView: FC<Props> = ({ product }) => {
  const addItem = useAddItem();
  const { data } = useCart();
  const { price } = usePrice({
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: product.price.currencyCode!,
  });
  const sendDataToGTM = useGTMDispatch();
  const { openSidebar } = useUI();
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState<SelectedOptions>({
    size: null,
    color: null,
  });

  const { data: customer } = useCustomer();

  useEffect(() => {
    sendDataToGTM({
      event: "pageMetaData",
      page: {
        category1: null,
        category2: null,
        category3: null,
        type: "product",
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

  useEffect(() => {
    const isPrima = collections.some(
      (c) => c.node.handle === "prima-collection"
    );
    // 7 = colour
    // 8 = quality
    sendDataToGTM({
      event: "productView",
      ecommerce: {
        detail: {
          products: [
            {
              brand: product.vendor,
              category: product.productType,
              currency: product.price?.currencyCode,
              dimension6: product.tags[0],
              dimension7: "",
              dimension8: "",
              dimension9: isPrima,
              id: product.id,
              name: product.name,
              price: product.price.value,
              url: "https://www.primavintage.co.uk/product/" + product.slug,
            },
          ],
        },
      },
    });
  }, []);

  const panels = [
    {
      label: "Details",
      content: `All of our items are one-of-a-kind unique pieces, and estimated sizing can often vary from the labelled title. All our estimates are based on a 5Ft 10 male model.\nLabel size: ${product.description}, our recommended size: ${product.tags[0]} `,
    },
    {
      label: "Shipping and Returns",
      content:
        "We offer a 7 day returns policy on all items. Reach out to contact@primavintage.co.uk for more details.",
    },
    {
      label: "Wear and Tear",
      content:
        "It's vintage. Wear and tear are par for the course. Unfortunately some items will have picked up some nicks during their time, and we try our best to photograph them to give you the heads up. But hey - if it was perfect, it wouldn't be vintage, right? Check out the details section for a run down of this item, and dont hesitate to get in touch if things aren't as spotless as you'd like.",
    },
    {
      label: "Our Ethos",
      content:
        "We are committed to helping the planet in every way we can - from selling vintage clothing to cut down on fast fashion, to using recycled packaging and offsetting our carbon footprint",
    },
  ];

  // Select the correct variant based on choices
  const variant = getVariant(product, choices);

  const collections = product.collections.edges;

  const addToCart = async () => {
    setLoading(true);
    try {
      if (!data.lineItems.some((i) => i.name === product.name)) {
        await addItem({
          productId: String(product.id),
          variantId: String(variant ? variant.id : product.variants[0].id),
        });
      }
      const isPrima = collections.some(
        (c) => c.node.handle === "prima-collection"
      );
      // 7 = colour
      // 8 = quality
      sendDataToGTM({
        event: "addToCart",
        ecommerce: {
          add: {
            products: [
              {
                brand: product.vendor,
                category: product.productType,
                currency: product.price?.currencyCode,
                dimension6: product.tags[0],
                dimension7: "",
                dimension8: "",
                dimension9: isPrima,
                id: product.id,
                name: product.name,
                price: product.price.value,
                quantity: "1",
              },
            ],
          },
        },
      });

      openSidebar();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Container
      className="max-w-none w-full checked-xlarge textured bg-violet"
      clean
    >
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: "website",
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images[0]?.url!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
      <Container>
        <div className={cn(s.root, "fit", "bg-white")}>
          <div className={cn(s.productDisplay, "fit")}>
            <div className={s.nameBox}>
              <h1 className={s.name}>{product.name}</h1>
              <div className={s.price}>
                {price}
                {` `}
                {product.price?.currencyCode}
              </div>
            </div>

            <div className={s.sliderContainer + " textured"}>
              <ProductSlider key={product.id}>
                {product.images.map((image, i) => (
                  <div key={image.url} className={s.imageContainer}>
                    <Image
                      className={s.img}
                      src={image.url!}
                      alt={image.alt || "Product Image"}
                      width={1050}
                      height={1050}
                      priority={i === 0}
                      quality="85"
                    />
                  </div>
                ))}
              </ProductSlider>
            </div>
          </div>
          <div className={s.sidebar}>
            <div>
              <section>
                <div className="pb-4" key={product.name}>
                  <h2 className="uppercase font-medium text-4xl">
                    {product.name}
                  </h2>
                  <h3 className="uppercase font-small mt-2 text-3xl">
                    {price}
                  </h3>
                </div>
              </section>
              <section className="mb-4 flex justify-between lg:max-w-xl">
                <div>
                  <h3 className="text-md md:text-xl">Size</h3>
                  <p className="capitalize">{product.tags[0]}</p>
                </div>
                <div>
                  <h3 className="text-md md:text-xl">Brand</h3>
                  <Link replace href={"/search/Type/" + product.vendor}>
                    <a className="underline-dotted">{product.vendor}</a>
                  </Link>
                </div>
                <div>
                  <h3 className="text-md md:text-xl">Type</h3>
                  <Link replace href={"/search/type/" + product.productType}>
                    <a className="underline-dotted">{product.productType}</a>
                  </Link>
                </div>
                {collections.length > 0 && (
                  <div>
                    <h3 className="text-md md:text-xl">
                      {"Collection " + (collections.length > 1 ? "s" : "")}
                    </h3>
                    <div className="flex">
                      {collections.map((col) => (
                        <a className="mr-4">
                          <Link
                            replace
                            href={"/search/" + col.node.handle}
                            key={col.node.handle}
                          >
                            <a className="underline-dotted">{col.node.title}</a>
                          </Link>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
              {product.availableForSale ? (
                <Button
                  aria-label="Add to Cart"
                  type="button"
                  className={s.button}
                  onClick={addToCart}
                  loading={loading}
                >
                  Add to Cart
                </Button>
              ) : (
                <span className="pt-10 pb-10 text-xl">Sold Out</span>
              )}
            </div>
            <Accordion panels={panels} />
            {/* <div>
              <h3 className="text-xl">Sizing</h3>
              <p className="text-sm">
                All of our items are one-of-a-kind unique pieces, and estimated
                sizing can often vary from the labelled title. All our estimates
                are based on a 5Ft 10 male model.
              </p>
              <p className="text-sm">{"Label size: " + product.description}</p>
              <p className="text-sm">
                Our recommended size:{" "}
                <span className="capitalize">{product.tags[0]}</span>
              </p>
            </div> */}
            <p className="text-xs mt-0 text-gray-500">{"ID: " + product.id}</p>
          </div>
          {process.env.COMMERCE_WISHLIST_ENABLED && (
            <WishlistButton
              className={s.wishlistButton}
              productId={product.id}
              variant={product.variants[0]! as any}
            />
          )}
        </div>
      </Container>
    </Container>
  );
};

export default ProductView;
