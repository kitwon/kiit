import React, { FunctionComponentElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 100px auto 20px;
  max-width: 750px;
  text-align: center;
  font-size: .85rem;
  color: #5e6467;

  a {
    color: #47c9e5;
  }
`

interface PropTypes {
  className?: string
}

const Footer = (): FunctionComponentElement<PropTypes> => (
  <Wrapper>
    <div>
      <span>© 2015 - 2018</span>
      &nbsp;
      <i className="icon ion-ios-nutrition" />
      &nbsp;
      <span>Kit</span>
    </div>
    <div>
      <span>power by </span>
      <span><a href="https://www.gatsbyjs.org">Gatsby.</a></span>
      <span> Design By Kit.</span>
    </div>
  </Wrapper>
)

export default Footer;
