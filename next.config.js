const commerce = require('./commerce.config.json');
const withCommerceConfig = require('./framework/commerce/with-config');

const isBC = commerce.provider === 'bigcommerce';
const isShopify = commerce.provider === 'shopify';

module.exports = withCommerceConfig({
  images: {
    domains: ['https://cdn.shopify.com'],
  },
  commerce,
  target: 'serverless',
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      (isBC || isShopify) && {
        source: '/checkout',
        destination: '/api/bigcommerce/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/bigcommerce/customers/logout?redirect_to=/',
      },
      // Rewrites for /search
      // {
      //   source: '/search/:type',
      //   destination: '/search',
      // },
      {
        source: '/search/type/:name',
        destination: '/search',
      },
      {
        source: '/search/type/:name/:category',
        destination: '/search',
      },
      {
        source: '/search/type/:name/designers/:name',
        destination: '/search',
      },
      {
        source: '/search/designers/:name',
        destination: '/search',
      },
      {
        source: '/search/designers/:name/:category',
        destination: '/search',
      },
      {
        source: '/search/type/:name/designers/:name/:category',
        destination: '/search',
      },
      {
        // This rewrite will also handle `/search/designers`
        source: '/search/:category',
        destination: '/search',
      },
    ].filter((x) => x);
  },
});
