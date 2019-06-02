module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/*': [
            `cache-control: public, max-age=0, must-revalidate`
          ]
        } // option to add more headers. `Link` headers are transformed by the below criteria
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/_posts`,
        name: 'markdown-pages'
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
        plugins: [
          `gatsby-remark-prismjs`
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass')
      }
    },
    `gatsby-transformer-html-excerpt`,
    `gatsby-plugin-styled-components`,
    `gatsby-remark-emoji`,
    `gatsby-plugin-lodash`
  ]
}
