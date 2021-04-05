import { useEffect, useState } from "react";
import getSlug from "./get-slug";

export function useSearchMeta(asPath: string) {
  const [pathname, setPathname] = useState<string>("/search");
  const [category, setCategory] = useState<string | undefined>();
  const [brand, setBrand] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();

  useEffect(() => {
    // Only access asPath after hydration to avoid a server mismatch
    const path = asPath
      .split("?")[0]
      .replace("/search/", "")
      .replace("/search", "");
    const parts = path.split("/");
    // /prima-collection
    // /type/tshirt
    // /type/tshirt/prima-collection
    // /type/tshirt/designers/nike
    // /designers/nike/prima-collection
    // /type/tshirt/designers/nike/prima-collection'

    let c = parts[0];
    if (c === "type" || c === "designers") {
      c = parts[2] || "";
    }
    if (c === "designers") {
      c = parts[4] || "";
    }

    let t = parts[1] || "";
    if (parts[0] === "designers") {
      t = "";
    }

    let b = parts[1] || "";
    if (parts[0] === "type" || parts[2] === "designers") {
      b = parts[3] || "";
    }
    if (parts[0] === undefined) {
      c = "";
      b = "";
      t = "";
    }
    // console.log("c", c, "b", b, "t", t);
    setPathname(path);
    if (c !== category) setCategory(c);
    if (b !== brand) setBrand(b);
    if (t !== type) setType(t);
  }, [asPath]);

  return { pathname, category, brand, type };
}

// Removes empty query parameters from the query object
export const filterQuery = (query: any) =>
  Object.keys(query).reduce<any>((obj, key) => {
    if (query[key]?.length) {
      obj[key] = query[key];
    }
    return obj;
  }, {});

export const getCategoryPath = (
  path: string,
  brand?: string,
  type?: string
) => {
  const category = getSlug(path);
  return `/search${type ? `/type/${type}` : ""}${
    brand ? `/designers/${brand}` : ""
  }${category ? `/${category}` : ""}`;
};

export const getDesignerPath = (
  path: string,
  category?: string,
  type?: string
) => {
  const designer = getSlug(path).replace(/^brands/, "designers");
  return `/search${type ? `/type/${type}` : ""}${
    designer ? `/${designer}` : ""
  }${category ? `/${category}` : ""}`;
};

export const getTypePath = (
  path: string,
  category?: string,
  brand?: string
) => {
  const type = getSlug(path);
  return `/search${type ? `/type/${type}` : ""}${
    brand ? `/designers/${brand}` : ""
  }${category ? `/${category}` : ""}`;
};
