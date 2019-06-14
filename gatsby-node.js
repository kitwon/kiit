const path = require('path');
// const { createPaginationPages } = require('gatsby-pagination')
// const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return graphql(`
    fragment FrontmatterFields on MarkdownRemarkFrontmatter {
      title
      date(formatString: "YYYY-MM-DD")
      category
      tags
      path
    }

    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              ...FrontmatterFields
            }
            excerpt(format: HTML)
            headings {
              depth
              value
            }
            html,
            tableOfContents
          },
          next {
            frontmatter {
              ...FrontmatterFields
            }
          }
          previous {
            frontmatter {
              ...FrontmatterFields
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const { edges } = result.data.allMarkdownRemark;
    const createPaginationPages = paginationPages(edges, createPage);

    // create post pages
    edges.forEach(({ node, previous, next }, index) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve('./src/templates/post.tsx'),
        context: {
          slug: node.fields.slug,
          next,
          previous
        },
      });
    });

    createPaginationPages({
      component: path.resolve('src/templates/archive.tsx'),
      limit: 20,
      path: 'archive',
    });

    const blogInfo = {
      edgesCount: edges.length
    }

    createPaginationPages({
      limit: 6,
      path: 'blog',
      component: path.resolve('src/templates/blog.tsx'),
      context: {
        blogInfo
      }
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    createNodeField({
      name: 'slug',
      node,
      value: node.frontmatter.path,
    });
  }
};

function paginationPages(edges, createPage) {
  return ({ component, context, path, limit }) => {
    const numPages = Math.ceil(edges.length / limit);

    const getPath = index => {
      if (typeof path === 'function') {
        return path(index);
      }

      if (typeof path === 'string') {
        return index === 0 ? `/${path}` : `/${path}/${index + 1}`;
      }
    };

    Array.from({ length: numPages }).forEach((_, index) => {
      createPage({
        path: getPath(index),
        component,
        context: {
          limit,
          skip: index * limit,
          numPages,
          currentPage: index + 1,
          ...context,
        },
      });
    });
  };
}
