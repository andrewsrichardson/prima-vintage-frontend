import fetchGraphqlApi from "../api/utils/fetch-graphql-api";
import getAllProductTags from "./queries/get-all-product-tags-query";

export type TagNode = {
  name: string;
};

export type TagEdge = {
  node: TagNode;
};

export type Tags = TagEdge[];

const fetchOptions = {};

const getTags = async (): Promise<TagEdge[]> => {
  const { data } = await fetchGraphqlApi(
    getAllProductTags,
    {
      variables: {
        first: 250,
      },
    },
    fetchOptions
  );

  let TagsStrings = data.productTags.edges.map(({ node }) => node);

  return [...new Set(TagsStrings)].map((v: string) => ({
    node: {
      name: v,
    },
  }));
};

export default getTags;
