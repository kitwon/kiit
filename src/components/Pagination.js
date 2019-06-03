import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const List = styled.div`
  position: relative;
  top: -1px;
  border-top: 1px solid #91979a;
  text-align: center;
`

const Item = styled(Link)`
  position: relative;
  display: inline-block;
  top: -1px;
  margin: 0 0.25rem;
  width: 1.75rem;
  height: 1.75rem;
  line-height: 1.55rem;
  text-align: center;
  border-top: 1px solid transparent;
  transition: all .2s;
  color: #525759;

  &:hover,
  &:active,
  &.active {
    color: #47c9e5;
    text-decoration: none;
    background: #f9f9f9;
      border-top: 1px solid #47c9e5;
  }
`

export default class Pagination extends React.Component {
  genItem() {
    const { currentPage, numPages } = this.props
    let arr = []

    for (let i = 0; i < numPages; i++) {
      const href = i === 0 ? `/blog` : `/blog/${i + 1}`
      arr.push(
        <Item activeClassName="active" to={href} key={i}>{i + 1}</Item>
      )
    };

    if (currentPage !== 1) {
      const href = currentPage === 2 ? `/blog` : `/blog/${currentPage - 1}`
      arr.unshift(
        <Item activeClassName="active" to={href} key="pagination-prev">
          <i className="ion-ios-arrow-back" />
        </Item>
      )
    }

    if (currentPage !== numPages) {
      arr.push(
        <Item activeClassName="active" to={`/blog/${currentPage + 1}`} key="pagination-next">
          <i className="ion-ios-arrow-forward" />
        </Item>
      )
    }

    return arr
  }

  render() {
    const { next, prev } = this.props

    return (
      <List className={this.props.className}>
        {prev ? <Item href={prev}><i className="ion-ios-arrow-back" /></Item> : null}
        {this.genItem()}
        {next ? <Item href={next}><i className="ion-ios-arrow-forward" /></Item> : null}
      </List>
    )
  }
}
