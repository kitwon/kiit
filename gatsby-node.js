const path = require("path");
const { createPaginationPages } = require('gatsby-pagination');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostPage = path.resolve(`src/pages/post.js`);
  const indexPage = path.resolve('src/pages/index.js');
  const archivePage = path.resolve('src/pages/archive.js');

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
              category
              tags
              path
            },
            excerpt,
            headings {
              depth
              value
            },
            html,
            htmlExcerpt
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { edges } = result.data.allMarkdownRemark

    const tags = createTagPages(edges, 'tags');
    const category = createTagPages(edges, 'category');

    createPaginationPages({
      edges,
      createPage,
      component: indexPage,
      limit: 5,
      pathFormatter: path => `/blog/${path}`,
      context: {
        edgesLen: edges.length,
        tagsLen: Object.keys(tags).length,
        categoryLen: Object.keys(category).length
      }
    });

    createPaginationPages({
      edges,
      createPage,
      component: archivePage,
      limit: 20,
      pathFormatter: path => `/archive/${path}`,
      context: {
        edgesLen: edges.length,
        tagsLen: Object.keys(tags).length,
        categoryLen: Object.keys(category).length
      }
    });



    edges.forEach(({ node }, index) => {
      const prev = index === 0 ? false : edges[index - 1].node.frontmatter;
      const next = index === edges.length - 1 ? false : edges[index + 1].node.frontmatter;

      createPage({
        path: node.frontmatter.path,
        component: blogPostPage,
        context: {
          prev,
          next
        }
      });
    });
  });
};

function createTagPages(edges, key) {
  const posts = {};

  edges.forEach(({node}, index) => {
    if (node.frontmatter[key]) {
      node.frontmatter[key].forEach(tag => {
        if (!posts[tag]) {
          posts[tag] = []
        }
        posts[tag].push(node);
      })
    }
  })

  return posts;
}
