import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: relative;
`;

const Item = styled.a`
  position: relative;
  display: inline-block;
  width: 33.33333%;
  padding: 13px 0;
  margin-left: -1px;
  border: 1px solid #b9bdbf;
  text-align: center;
  font-size: 13px;
  color: #6b7174;
  box-sizing: border-box;

  &:before {
    right: -1px;
  }

  &:after {
    left: -1px;
  }

  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    z-index: 2;
    top: 50%;
    margin-top: -.9em;
    height: 1.8em;
    border-left: 1px solid #fff;
  }
`;

export default class SideNav extends React.Component {
  render() {
    return (
      <Nav>
        <Item href="">首页</Item>
        <Item>归档</Item>
        <Item>标签</Item>
      </Nav>
    );
  }
}
