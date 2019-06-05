import React, { FunctionComponentElement, ReactElement } from 'react'
import Item from './post-item'

interface PropTypes {
  postEdges: any
}

const PostList = ({ postEdges }: PropTypes): FunctionComponentElement<PropTypes> => {
  return (
    <div>
      {
        postEdges.map((item: any): ReactElement => <Item postData={item.node} key={item.name} />)
      }
    </div>
  )
}

export default PostList;
