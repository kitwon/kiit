const { GraphQLString } = require('graphql');
const remark = require('remark');
var recommended = require('remark-preset-lint-recommended');
var html = require('remark-html');
var report = require('vfile-reporter');

let pluginsCacheStr = ``
let pathPrefixCacheStr = ``
const htmlCacheKey = node =>
  `transformer-remark-markdown-html-${
    node.internal.contentDigest
  }-${pluginsCacheStr}-${pathPrefixCacheStr}`
const htmlAstCacheKey = node =>
  `transformer-remark-markdown-html-ast-${
    node.internal.contentDigest
  }-${pluginsCacheStr}-${pathPrefixCacheStr}`

exports.setFieldsOnGraphQLNodeType = ({ type, store, pathPrefix, getNode, cache }) => {
  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  async function getHTML(markdownNode) {
    return new Promise((resolve, reject) => {
      remark()
        .use(recommended)
        .use(html)
        .process(markdownNode, (err, file) => {
          if (err) reject(err || file);

          resolve(String(file));
        })
    });
  }

  return new Promise((resolve, reject) => {
    return resolve({
      htmlExcerpt: {
        type: GraphQLString,
        resolve(markdownNode) {
          return getHTML(markdownNode.excerpt);
        }
      }
    })
  })
}
