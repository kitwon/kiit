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
  line-height: 1;

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

  span {
    position: relative;

    &:after,
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -0.4em;
      height: 0.8em;
      border-left: 1px solid #8addee;
      opacity: 0;
      transition: all .3s cubic-bezier(.55,0,.1,1);
    }
  }

  &:after {
    left: -1px;
  }

  &:before {
    right: -1px;
  }

  &:hover {
    text-decoration: none;
    color: inherit;

    span {
      &:after {
        transform: translate3d(1.6em, 0, 0) rotate(30deg);
        opacity: 1;
      }
      &:before {
        transform: translate3d(-1.6em, 0, 0) rotate(30deg);
        opacity: 1;
      }
    }
  }
`;

export default class SideNav extends React.Component {
  unComplete() {
    alert('此功能暂未开放~');
  }

  render() {
    return (
      <Nav>
        <Item href="/blog/1"><span>首页</span></Item>
        <Item href="/archive/1"><span>归档</span></Item>
        <Item href="javascript:;" onClick={this.unComplete}><span>标签</span></Item>
      </Nav>
    );
  }
}
