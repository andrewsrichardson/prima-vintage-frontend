const getAllProductTags = /* GraphQL */ `
  query getAllProductTags($first: Int = 250) {
    productTags(first: $first) {
      edges {
        node
      }
    }
  }
`;
export default getAllProductTags;
