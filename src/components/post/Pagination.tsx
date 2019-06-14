import React, { FunctionComponentElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 40px auto 0;
  text-align: center;
  padding: 30px 0;
  border-top: 1px solid #ddd;
`

const Button = styled.a`
 display: inline-block;
  margin: 0 10px;
  color: #fff;
  background-color: #1ca6c4;
  font-size: .875rem;
  padding: .2em .75em;
  border-radius: .3rem;
  box-shadow: 0 5px 0 #158097;
  transition: all .3s cubic-bezier(.55,0,.1,1);

  &:hover {
    text-decoration: none;
    background-color: #1fb9da;
    color: #fff;
    outline: none;
  }

  &:active {
    text-decoration: none;
    background-color: #1ca6c4;
    color: #126d81;
    text-shadow: 0 1px hsla(0,0%,100%,.4);
    box-shadow: 0 2px 0 #158097;
  }
`

interface PropTypes {
  next: any
  prev: any
}

const PostPagination = ({ prev, next }: PropTypes): FunctionComponentElement<PropTypes> => {
  return (
    <Wrapper>
      {prev ? (
        <Button href={prev.frontmatter.path}>
          <i className="ion-arrow-left-c" />
          &nbsp;
          {prev.frontmatter.title}
        </Button>
      )
      : null}

      {next ? (
        <Button href={next.frontmatter.path}>
          {next.frontmatter.title}
          &nbsp;
          <i className="ion-arrow-right-c" />
        </Button>
      )
      : null}
    </Wrapper>
  )
}

export default PostPagination
