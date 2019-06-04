const path = require('path');
// const { createPaginationPages } = require('gatsby-pagination')
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000,
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
              category
              tags
              path
            },
            excerpt(format: HTML),
            headings {
              depth
              value
            },
            html
          }
        }
      }
    }
  `).then((result) => {
        if (result.errors) {
            return Promise.reject(result.errors);
        }

        const { edges } = result.data.allMarkdownRemark;
        const createPaginationPages = paginationPages(edges, createPage);

        // create post pages
        edges.forEach(({ node }) => {
            createPage({
                path: node.frontmatter.path,
                component: path.resolve('./src/templates/post.tsx'),
                context: {
                    slug: node.fields.slug,
                },
            });
        });

        createPaginationPages({
            component: path.resolve('src/templates/archive.tsx'),
            limit: 20,
            path: 'archive',
        });

        createPaginationPages({
            limit: 5,
            path: 'blog',
            component: path.resolve('src/templates/blog.tsx'),
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
    if (node.internal.type === 'MarkdownRemark') {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: 'slug',
            node,
            value,
        });
    }
};

function paginationPages(edges, createPage) {
    return ({
 component, context, path, limit
}) => {
        const numPages = Math.ceil(edges.length / limit);

        const getPath = (index) => {
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
