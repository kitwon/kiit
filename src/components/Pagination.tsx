import React, { FunctionComponentElement } from 'react'
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
interface PropTypes {
  currentPage: number
  numPages: number
  pageName: string
  className?: string
  prev?: any
  next?: any
}

const Pagination = (props: PropTypes): FunctionComponentElement<PropTypes> => {
  const { className, numPages, pageName, currentPage } = props

  const items = []

  for (let i = 0; i < numPages; i += 1) {
    const href = i === 0 ? `/${pageName}` : `/${pageName}/${i + 1}`
    items.push(
      <Item activeClassName="active" to={href} key={i}>{i + 1}</Item>
    )
  };

  if (currentPage !== 1) {
    const href = currentPage === 2 ? `/${pageName}` : `/${pageName}/${currentPage - 1}`
    items.unshift(
      <Item activeClassName="active" to={href} key="pagination-prev">
        <i className="ion-ios-arrow-back" />
      </Item>
    )
  }

  if (currentPage !== numPages) {
    items.push(
      <Item activeClassName="active" to={`/${pageName}/${currentPage + 1}`} key="pagination-next">
        <i className="ion-ios-arrow-forward" />
      </Item>
    )
  }

  return <List className={className}>{items}</List>
}

export default Pagination
