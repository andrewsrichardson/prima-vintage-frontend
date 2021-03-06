import cn from "classnames";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "@components/common";
import { ProductCard } from "@components/product";
import { Container, Grid, Skeleton } from "@components/ui";

import { getConfig } from "@framework/api";
import useSearch from "@framework/product/use-search";
import getAllPages from "@framework/common/get-all-pages";
import getSiteInfo from "@framework/common/get-site-info";

import rangeMap from "@lib/range-map";
import getSlug from "@lib/get-slug";

const SORT = Object.entries({
  "latest-desc": "Latest arrivals",
  "trending-desc": "Trending",
  "price-asc": "Price: Low to high",
  "price-desc": "Price: High to low",
});

import {
  filterQuery,
  getCategoryPath,
  getDesignerPath,
  getTypePath,
  useSearchMeta,
} from "@lib/search";
import { Product } from "@commerce/types";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";
import { useCustomer } from "@framework/customer";

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale });
  const { pages } = await getAllPages({ config, preview });
  const { categories, brands, types, tags } = await getSiteInfo({
    config,
    preview,
  });
  return {
    props: {
      pages,
      categories,
      brands,
      types,
      tags,
    },
  };
}

export default function Search({
  categories,
  brands,
  types,
  tags,
  pages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [activeFilter, setActiveFilter] = useState("");
  const [toggleFilter, setToggleFilter] = useState(false);
  const sendDataToGTM = useGTMDispatch();

  const router = useRouter();
  const { asPath } = router;
  const { q, sort } = router.query;
  // `q` can be included but because categories and designers can't be searched
  // in the same way of products, it's better to ignore the search input if one
  // of those is selected
  const query = filterQuery({ sort });

  const { pathname, category, brand, type } = useSearchMeta(asPath);

  const activeCategory = categories.find(
    (cat) => getSlug(cat.path) === `${category}`
  );
  const activeBrand = brands.find(
    (b) => getSlug(b.node.path) === `brands/${brand}`
  )?.node;

  const activeType = types.find((b) => {
    return getSlug(b.node.name) === `${type}`;
  })?.node;

  const { data } = useSearch({
    search: typeof q === "string" ? q : "",
    categoryId: activeCategory?.entityId as any,
    brandId: (activeBrand as any)?.entityId,
    type: (activeType as any)?.name,
    sort: typeof sort === "string" ? sort : "",
  });

  const { data: customer } = useCustomer();

  useEffect(() => {
    sendDataToGTM({
      event: "pageMetaData",
      page: {
        category1: type,
        category2: brand,
        category3: category,
        type: "search",
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
    if (data) {
      sendDataToGTM({
        event: "productImpression",
        ecommerce: {
          impressions: data.products.map((product, index) => {
            return {
              list: "Product Listing Page",
              brand: product.vendor,
              category: product.productType,
              currency: product.price?.currencyCode,
              dimension6: product.tags[0] || null,
              dimension7: "",
              dimension8: "",
              dimension9: category === "prima-collection",
              id: product.id,
              name: product.name,
              price: product.price.value,
              quantity: "1",
              position: index,
              url: "https://www.primavintage.co.uk/search",
            };
          }),
        },
      });
    }
  }, [category, brand, type, sort, data]);

  const handleClick = (event: any, filter: string) => {
    if (filter !== activeFilter) {
      setToggleFilter(true);
    } else {
      setToggleFilter(!toggleFilter);
    }
    setActiveFilter(filter);
  };

  const handleProductClick = (product) => {
    sendDataToGTM({
      event: "productClick",
      ecommerce: {
        currencyCode: "GBP",
        click: {
          actionField: {
            list: "Product Listing Page",
          },
          products: [
            {
              brand: product.vendor,
              category: product.productType,
              currency: product.price?.currencyCode,
              dimension6: product.tags[0] || null,
              dimension7: "",
              dimension8: "",
              dimension9: category === "prima-collection",
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
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-20">
        <div className="col-span-8 lg:col-span-2 order-1 lg:order-none ">
          {/* Categories */}
          <div className="relative inline-block w-full">
            <div className="mt-4 lg:hidden">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, "categories")}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeCategory?.name
                    ? `Category: ${activeCategory?.name}`
                    : "All Categories"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== "categories" || toggleFilter !== true
                  ? "hidden"
                  : ""
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        "block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                        {
                          underline: !activeCategory?.name,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: getCategoryPath("", brand, type),
                          query,
                        }}
                      >
                        <h2
                          onClick={(e) => handleClick(e, "categories")}
                          className="block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4 cursor-pointer text-gray-900"
                        >
                          ALL CATEGORIES
                          <span className="text-gray-400 text-sm text ml-1">
                            {activeCategory ? "(clear)" : null}
                          </span>
                        </h2>
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li
                        key={cat.path}
                        className="block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                      >
                        <Link
                          href={{
                            pathname: getCategoryPath(cat.path, brand, type),
                            query,
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, "categories")}
                            className={cn(
                              "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4",
                              {
                                underline:
                                  activeCategory?.entityId === cat.entityId,
                              }
                            )}
                          >
                            {cat.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Types */}
          <div className="relative inline-block w-full">
            <div className="lg:hidden mt-3">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, "type")}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeType?.name
                    ? `Design: ${activeType?.name}`
                    : "All Designs"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== "type" || toggleFilter !== true ? "hidden" : ""
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        "block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                        {
                          underline: !activeType?.name,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: getTypePath("", category, brand),
                          query,
                        }}
                      >
                        <h2
                          onClick={(e) => handleClick(e, "type")}
                          className={
                            "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4  cursor-pointer text-gray-900"
                          }
                        >
                          ALL TYPES
                          <span className="text-gray-400 text-sm text ml-1">
                            {activeType ? "(clear)" : null}
                          </span>
                        </h2>
                      </Link>
                    </li>
                    {types.flatMap(({ node }) => (
                      <li
                        key={node.name}
                        className={cn(
                          "block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                          {
                            // @ts-ignore Shopify - Fix this types
                            underline: activeType?.name === node.name,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname: getTypePath(node.name, category, brand),
                            query,
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, "type")}
                            className={
                              "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4"
                            }
                          >
                            {node.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Designs */}
          <div className="relative inline-block w-full">
            <div className="lg:hidden mt-3">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, "brands")}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {activeBrand?.name
                    ? `Brand: ${activeBrand?.name}`
                    : "All Brands"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== "brands" || toggleFilter !== true
                  ? "hidden"
                  : ""
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        "block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                        {
                          underline: !activeBrand?.name,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: getDesignerPath("", category, type),
                          query,
                        }}
                      >
                        <h2
                          onClick={(e) => handleClick(e, "brands")}
                          className={
                            "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4 cursor-pointer text-gray-900"
                          }
                        >
                          ALL BRANDS
                          <span className="text-gray-400 text-sm text ml-1">
                            {activeBrand ? "(clear)" : null}
                          </span>
                        </h2>
                      </Link>
                    </li>
                    {brands.flatMap(({ node }) => (
                      <li
                        key={node.path}
                        className={cn(
                          "block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                          {
                            // @ts-ignore Shopify - Fix this types
                            underline: activeBrand?.entityId === node.entityId,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname: getDesignerPath(
                              node.path,
                              category,
                              type
                            ),
                            query,
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, "brands")}
                            className={
                              "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4"
                            }
                          >
                            {node.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products */}
        <div className="col-span-8 order-3 lg:order-none">
          {(q || activeCategory || activeBrand || activeType || sort) && (
            <div className="p-6 transition ease-in duration-75 bg-white">
              {data ? (
                <>
                  <span
                    className={cn("animated italic", {
                      fadeIn: data.found,
                      hidden: !data.found,
                    })}
                  >
                    {(activeCategory?.name ? activeCategory.name + " /" : "") +
                      (activeBrand ? `${activeBrand.name} /` : "") +
                      (activeType ? ` ${activeType.name}` : "")}{" "}
                    ({data.products.length} results){" "}
                    {q && (
                      <>
                        for "<strong>{q}</strong>"
                      </>
                    )}
                    {sort
                      ? "Sort: " + SORT[SORT.findIndex((s) => s[0] === sort)][1]
                      : ""}
                  </span>
                  <span
                    className={cn("animated", {
                      fadeIn: !data.found,
                      hidden: data.found,
                    })}
                  >
                    {q ? (
                      <>
                        There are no products that match "<strong>{q}</strong>"
                      </>
                    ) : (
                      <>
                        There are no products that match the selected filters ????
                      </>
                    )}
                  </span>
                </>
              ) : q ? (
                <>
                  Searching for: "<strong>{q}</strong>"
                </>
              ) : (
                <>Searching...</>
              )}
            </div>
          )}

          {data ? (
            <Grid layout="normal">
              {data.products.map((product: Product) => (
                <div onClick={() => handleProductClick(product)}>
                  <ProductCard
                    variant="simple"
                    key={product.path}
                    className="animated fadeIn"
                    product={product}
                    imgProps={{
                      width: 480,
                      height: 480,
                    }}
                  />
                </div>
              ))}
            </Grid>
          ) : (
            <Grid layout="normal">
              {rangeMap(12, (i) => (
                <Skeleton
                  key={i}
                  className="w-full animated fadeIn"
                  height={325}
                />
              ))}
            </Grid>
          )}
        </div>

        {/* Sort */}
        <div className="col-span-8 lg:col-span-2 order-2 lg:order-none">
          <div className="relative inline-block w-full">
            <div className="lg:hidden">
              <span className="rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={(e) => handleClick(e, "sort")}
                  className="flex justify-between w-full rounded-sm border border-gray-300 px-4 py-3 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {sort ? `Sort: ${sort}` : "Relevance"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div
              className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
                activeFilter !== "sort" || toggleFilter !== true ? "hidden" : ""
              }`}
            >
              <div className="rounded-sm bg-white shadow-xs lg:bg-none lg:shadow-none">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <ul>
                    <li
                      className={cn(
                        "block text-sm leading-5 text-gray-700 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                        {
                          underline: !sort,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: `/search/${pathname}`,
                          query: filterQuery({ q }),
                        }}
                      >
                        <h2
                          onClick={(e) => handleClick(e, "sort")}
                          className={
                            "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4 cursor-pointer text-gray-900"
                          }
                        >
                          RELEVANCE
                          <span className="text-gray-400 text-sm text ml-1">
                            {sort ? "(clear)" : null}
                          </span>
                        </h2>
                      </Link>
                    </li>
                    {SORT.map(([key, text]) => (
                      <li
                        key={key}
                        className={cn(
                          "block text-sm leading-5 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900",
                          {
                            underline: sort === key,
                          }
                        )}
                      >
                        <Link
                          href={{
                            pathname: `/search/${pathname}`,
                            query: filterQuery({ q, sort: key }),
                          }}
                        >
                          <a
                            onClick={(e) => handleClick(e, "sort")}
                            className={
                              "block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4"
                            }
                          >
                            {text}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

Search.Layout = Layout;
