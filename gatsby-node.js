const path = require('path')
const { createPaginationPages } = require('gatsby-pagination')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

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
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { edges } = result.data.allMarkdownRemark
    const tags = createTagPages(edges, 'tags')
    const category = createTagPages(edges, 'category')

    edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: path.resolve('./src/templates/post.js'),
        context: {
          slug: node.fields.slug
        }
      })
    })

    createPaginationPages({
      edges,
      createPage,
      component: path.resolve('src/templates/archive.js'),
      limit: 20,
      pathFormatter: path => `/archive/${path}`,
      context: {
        edgesLen: edges.length,
        tagsLen: Object.keys(tags).length,
        categoryLen: Object.keys(category).length
      }
    })

    const postsPerPage = 5
    const numPages = Math.ceil(edges.length / postsPerPage)
    Array.from({ length: numPages }).forEach((_, index) => {
      createPage({
        path: index === 0 ? `/blog` : `/blog/${index + 1}`,
        component: path.resolve('src/templates/blog.js'),
        context: {
          limit: postsPerPage,
          skip: index * postsPerPage,
          currentPage: index + 1,
          numPages
        }
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}

function createTagPages(edges, key) {
  const posts = {}

  edges.forEach(({ node }, index) => {
    if (node.frontmatter[key]) {
      node.frontmatter[key].forEach(tag => {
        if (!posts[tag]) {
          posts[tag] = []
        }
        posts[tag].push(node)
      })
    }
  })

  return posts
}
