import fetchGraphqlApi from "../api/utils/fetch-graphql-api";
import { ShopifyConfig } from "../api";
import getAllProductTypes from "./queries/get-all-product-types-query";

export type TypeNode = {
  name: string;
};

export type TypeEdge = {
  node: TypeNode;
};

export type Types = TypeEdge[];

const fetchOptions = {};
const getTypes = async (): Promise<TypeEdge[]> => {
  const { data, res } = await fetchGraphqlApi(
    getAllProductTypes,
    {
      variables: { first: 250 },
    },
    fetchOptions
  );

  let TypeStrings = data.productTypes.edges.map(({ node }) => node);

  return [...new Set(TypeStrings)].map((v: string) => ({
    node: {
      name: v,
    },
  }));
};

export default getTypes;
