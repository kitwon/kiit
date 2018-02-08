module.exports = {
  plugins: [
    `gatsby-plugin-netlify-cms`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/_posts`,
        name: "markdown-pages",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`
      }
    },
    `gatsby-transformer-html-excerpt`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sass`,
    `gatsby-remark-emoji`
  ],
};
