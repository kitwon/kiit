module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*':[
            `cache-control: public, max-age=0, must-revalidate`
          ]
        }, // option to add more headers. `Link` headers are transformed by the below criteria
      },
    },
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
    `gatsby-remark-emoji`,
    `gatsby-plugin-lodash`
  ],
};
