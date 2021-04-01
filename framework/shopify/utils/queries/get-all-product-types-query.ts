const getAllProductTypes = /* GraphQL */ `
  query getAllProductTypes($first: Int = 250) {
    productTypes(first: $first) {
      edges {
        node
      }
    }
  }
`;
export default getAllProductTypes;
