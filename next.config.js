// next.config.js
const withSass = require('@zeit/next-sass');

module.exports = withSass({
    assetPrefix: process.env.BASE_PATH,
    publicRuntimeConfig: {
        basePath: process.env.BASE_PATH,
    },
});
