const { GraphQLString } = require('graphql')
const remark = require('remark')
var recommended = require('remark-preset-lint-recommended')
var html = require('remark-html')

exports.setFieldsOnGraphQLNodeType = ({ type, store, pathPrefix, getNode, cache }) => {
  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  function getHTML(markdownNode) {
    return new Promise((resolve, reject) => {
      remark()
        .use(recommended)
        .use(html)
        .process(markdownNode, (err, file) => {
          if (err) reject(err || file)

          resolve(file)
        })
    })
  }

  return new Promise((resolve, reject) => {
    return resolve({
      htmlExcerpt: {
        type: GraphQLString,
        resolve(markdownNode) {
          return getHTML(markdownNode.excerpt)
        }
      }
    })
  })
}
