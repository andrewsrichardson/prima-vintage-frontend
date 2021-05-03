import Cookies from "js-cookie";
import { useHook, useSWRHook } from "../utils/use-hook";
import type { HookFetcherFn, SWRHook } from "../utils/types";
import type { Cart } from "../types";
import { Provider, useCommerce } from "..";

export type FetchCartInput = {
  cartId?: Cart["id"];
};

export type UseNav<
  H extends SWRHook<any, any, any> = SWRHook<null, {}, null>
> = ReturnType<H["useHook"]>;

export const fetcher = async ({ options, fetch, input }) => {
  return await fetch({ ...options });
};

const fn = (provider: Provider) => provider.navigation?.useNav!;

const useNav: UseNav = (input) => {
  const hook = useHook(fn);
  // const { cartCookie } = useCommerce();
  const fetcherFn = hook.fetcher ?? fetcher;
  const wrapper: typeof fetcher = (context) => {
    // context.input.cartId = Cookies.get(cartCookie);
    return fetcherFn(context);
  };
  return useSWRHook({ ...hook, fetcher: wrapper })(input);
};

export default useNav;
