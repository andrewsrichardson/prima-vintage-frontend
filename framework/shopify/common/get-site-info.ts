import getCategories, { Category } from "../utils/get-categories";
import getVendors, { Brands } from "../utils/get-vendors";
import getTypes, { Types } from "../utils/get-types";
import getTags, { Tags } from "../utils/get-tags";

import { getConfig, ShopifyConfig } from "../api";

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[];
    brands: Brands;
    types: Types;
    tags: Tags;
  }
> = T;

const getSiteInfo = async (options?: {
  variables?: any;
  config: ShopifyConfig;
  preview?: boolean;
}): Promise<GetSiteInfoResult> => {
  let { config } = options ?? {};

  config = getConfig(config);

  const categories = await getCategories(config);
  const brands = await getVendors(config);
  const types = await getTypes(config);
  const tags = await getTags(config);

  return {
    categories,
    brands,
    types,
    tags,
  };
};

export default getSiteInfo;
