import { useMemo } from "react";
import useCommerceCart, { UseNav } from "@commerce/nav/use-nav";

import { Cart } from "../types";
import { SWRHook } from "@commerce/utils/types";
import getAllProductNav from "@framework/utils/queries/get-all-product-nav-query";

export default useCommerceCart as UseNav<typeof handler>;

export const handler: SWRHook<null, {}, null, { isEmpty?: boolean }> = {
  fetchOptions: {
    query: getAllProductNav,
  },
  async fetcher({ input, options, fetch }) {
    const data = await fetch({
      ...options,
    });
    const normalized = {
      collections:
        data.collections.edges.map((n) => {
          return { title: n.node.title, handle: n.node.handle };
        }) || null,
      brands:
        Array.from(new Set(data.products.edges.map((v) => v.node.vendor))) ||
        null,
      types: data.shop.productTypes.edges.map((t) => t.node) || null,
    };
    return normalized;
  },
  useHook: ({ useData }) => (input) => {
    const response = useData({
      swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
    });
    return useMemo(
      () =>
        Object.create(response, {
          isEmpty: {
            get() {
              return (response.data?.lineItems.length ?? 0) <= 0;
            },
            enumerable: true,
          },
        }),
      [response]
    );
  },
};
