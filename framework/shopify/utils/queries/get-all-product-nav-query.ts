const getAllProductNav = `
query getAllProductNav($first: Int = 250) {
  shop{
    productTypes(first: $first) {
      edges {
        node
      }
    }

  }
  products(first: $first) {
    edges {
      node {
        vendor
      }
    }
  }
  collections (first:$first){
    edges{
      node{
        title
        handle
      }
    }
  }
}`;
export default getAllProductNav;
