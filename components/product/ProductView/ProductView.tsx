import cn from "classnames";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { FC, useState } from "react";
import s from "./ProductView.module.css";

import { Swatch, ProductSlider } from "@components/product";
import { Button, Container, Text, useUI } from "@components/ui";

import type { Product } from "@commerce/types";
import usePrice from "@framework/product/use-price";
import { useAddItem } from "@framework/cart";

import { getVariant, SelectedOptions } from "../helpers";
import WishlistButton from "@components/wishlist/WishlistButton";
import Link from "next/link";

interface Props {
  className?: string;
  children?: any;
  product: Product;
}

const ProductView: FC<Props> = ({ product }) => {
  const addItem = useAddItem();
  const { price } = usePrice({
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: product.price.currencyCode!,
  });
  const { openSidebar } = useUI();
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState<SelectedOptions>({
    size: null,
    color: null,
  });

  // Select the correct variant based on choices
  const variant = getVariant(product, choices);

  const addToCart = async () => {
    setLoading(true);
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0].id),
      });
      openSidebar();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const collections = product.collections.edges;

  return (
    <Container className="max-w-none w-full" clean>
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
      <div className={cn(s.root, "fit")}>
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
          <section>
            <div className="pb-4" key={product.name}>
              <h2 className="uppercase font-medium text-2xl">{product.name}</h2>
              <h3 className="uppercase font-small text-xl">{price}</h3>
            </div>
          </section>
          <div>
            <h3 className="text-xl">Brand</h3>
            <Link replace href={"/search/Type/" + product.vendor}>
              <a className="underline-dotted">{product.vendor}</a>
            </Link>
          </div>
          {collections.length > 0 && (
            <div>
              <h3 className="text-xl">
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

          <div>
            <h3 className="text-xl">Type</h3>
            <Link replace href={"/search/" + product.productType}>
              <a className="underline-dotted">{product.productType}</a>
            </Link>
          </div>
          <div>
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
            <h3 className="text-xl">Returns</h3>
            <p className="text-sm">
              We offer a 7 day returns policy on all items. Reach out to
              contact@primavintage.co.uk for more details.
            </p>
          </div>

          <div>
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
            >
              Add to Cart
            </Button>
            <p className="text-xs mt-0 text-gray-500">{"ID: " + product.id}</p>
          </div>
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
  );
};

export default ProductView;
