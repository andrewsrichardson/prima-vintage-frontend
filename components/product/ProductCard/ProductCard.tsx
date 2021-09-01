import { FC, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import type { Product } from "@commerce/types";
import s from "./ProductCard.module.css";
import Image, { ImageProps } from "next/image";
import WishlistButton from "@components/wishlist/WishlistButton";

interface Props {
  className?: string;
  product: Product;
  variant?: "slim" | "simple";
  imgProps?: Omit<ImageProps, "src">;
}

const placeholderImg = "/product-img-placeholder.svg";

const ProductCard: FC<Props> = ({
  className,
  product,
  variant,
  imgProps,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  return (
    <Link href={`/product/${product.slug}`} {...props}>
      <a
        className={cn(s.root, { [s.simple]: variant === "simple" }, className)}
      >
        {variant === "slim" ? (
          <div className="relative overflow-hidden box-border">
            <div className="absolute inset-0 flex items-center justify-end mr-8 z-20">
              <span className="bg-black text-white inline-block p-3 text-xl break-words">
                {product.name}
              </span>
              <span className="bg-black text-white inline-block p-3 text-xl break-words">
                {product.availableForSale ? product.price.value : "Sold Out"}
              </span>
            </div>
            {product?.images && (
              <Image
                quality="85"
                src={product.images[0].url || placeholderImg}
                alt={product.name || "Product Image"}
                height={320}
                width={320}
                layout="intrinsic"
                objectFit="cover"
                {...imgProps}
              />
            )}
          </div>
        ) : (
          <>
            <div className={s.squareBg} />
            <div className={s.imageContainer}>
              {product?.images && (
                <Image
                  alt={product.name || "Product Image"}
                  className={s.productImage}
                  src={
                    hover
                      ? product.images[1]?.url || placeholderImg
                      : product.images[0].url || placeholderImg
                  }
                  onMouseOver={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  height={816}
                  width={540}
                  quality="60"
                  layout="intrinsic"
                  objectFit="cover"
                  {...imgProps}
                />
              )}
            </div>
            <div className="flex flex-row justify-between box-border w-full z-20 relative">
              <div className="relative w-full flex justify-between">
                <h3 className={s.productTitle}>
                  <span>{product.name}</span>
                </h3>
                <p className={s.productTitle} style={{ maxWidth: "40px" }}>
                  {"£" + product.price.value}
                </p>
              </div>
              {process.env.COMMERCE_WISHLIST_ENABLED && (
                <div>
                  <WishlistButton
                    className={s.wishlistButton}
                    productId={product.id}
                    variant={product.variants[0] as any}
                  />
                  <span className={s.productPrice}>
                    {product.price.value}
                    &nbsp;
                    {product.price.currencyCode}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </a>
    </Link>
  );
};

export default ProductCard;
