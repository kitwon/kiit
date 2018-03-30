import React from 'react'
// import styled from 'styled-components'

import Item from './post-item'

export default class PostList extends React.Component {
  render() {
    const { postEdges } = this.props
    return (
      <div>
        {
          postEdges.map((item, key) => {
            return <Item postData={item.node} key={key} />
          })
        }
      </div>
    )
  }
}
