const path = require("path");
const { createPaginationPages } = require('gatsby-pagination');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostPage = path.resolve(`src/pages/post.js`);
  const indexPage = path.resolve('src/pages/index.js');

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              title,
              date(formatString: "YYYY-MM-DD"),
              category,
              tags,
              path
            },
            excerpt,
            htmlExcerpt,
            html
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { edges } = result.data.allMarkdownRemark
    console.log(edges.htmlExcerpt);

    createPaginationPages({
      edges,
      createPage,
      component: indexPage,
      limit: 5,
      pathFormatter: path => `/blog/${path}`
    });

    edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostPage,
      });
    });
  });
};
