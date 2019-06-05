import React, { FunctionComponentElement, ReactElement } from 'react'
import Item from './post-item'

interface PropTypes {
  postEdges: any
}

const PostList = ({ postEdges }: PropTypes): FunctionComponentElement<PropTypes> => (
  <div>
    {postEdges.map((item: any): ReactElement =>
      <Item postData={item.node} key={item.node.frontmatter.path} />
    )}
  </div>
)

export default PostList;
