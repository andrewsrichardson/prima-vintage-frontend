import { Product } from "@commerce/types";
import { getConfig, ShopifyConfig } from "../api";
import fetchAllProducts from "../api/utils/fetch-all-products";
import { ProductEdge } from "../schema";
import getAllProductsPathsQuery from "../utils/queries/get-all-products-paths-query";

type ProductPath = {
  slug: string;
};

export type ProductPathNode = {
  node: ProductPath;
};

type ReturnType = {
  products: ProductPathNode[];
};

const getAllProductPaths = async (options?: {
  variables?: any;
  config?: ShopifyConfig;
  preview?: boolean;
}): Promise<ReturnType> => {
  let { config, variables = { first: 250 } } = options ?? {};
  config = getConfig(config);

  const products = await fetchAllProducts({
    config,
    query: getAllProductsPathsQuery,
    variables,
  });

  return {
    products: products?.map(({ node: { handle } }: ProductEdge) => ({
      node: {
        slug: `${handle}`,
      },
    })),
  };
};

export default getAllProductPaths;
