const getProductQuery = /* GraphQL */ `
  query getProductBySlug($slug: String!) {
    productByHandle(handle: $slug) {
      availableForSale
      id
      handle
      title
      productType
      vendor
      description
      descriptionHtml
      tags
      collections(first: 10) {
        edges {
          node {
            handle
            title
          }
        }
      }
      options {
        id
        name
        values
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 250) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            sku
            selectedOptions {
              name
              value
            }
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
          }
        }
      }
      images(first: 250) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            originalSrc
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export default getProductQuery;
