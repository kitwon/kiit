import React from 'react'
import styled from 'styled-components'

// import getRaf from '../../utils/raf'

const Wrapper = styled.div`
  display: block;
  padding: 30px 5px;
  background: #fff;
  border-bottom: 1px solid #e1e2e3;

  .title {
    position: relative;
    text-align: center;
    padding-bottom: 5px;
    margin-bottom: 30px;

    &:after {
      content: "";
      display: block;
      position: absolute;
      width: 30px;
      border-bottom: 1px solid #74d6eb;
      bottom: 0;
      left: 50%;
      margin-left: -15px;
    }
  }
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;

  li {
    color: #6b7174;
    cursor: pointer;

    &:hover {
      color: #1993ad;
      text-decoration: underline;
    }
  }

  .l1 {
    padding-left: 0;
  }

  .l2 {
    padding-left: 1em;
  }

  .l3 {
    padding-left: 2em;
  }

  .l4 {
    padding-left: 3em;
  }
`

export default class TitleList extends React.Component {
  onItemClick(id) {
    const pos = document.getElementById(id).offsetTop
    this.scrollToPos(pos)

    return false
  }

  scrollToPos(pos) {
    document.documentElement.scrollTop = pos - 50
    // if (document.documentElement.scrollTop > pos) requestFrame(this.goPageTop);
  }

  render() {
    return (
      <Wrapper>
        <div>
          <div className="title">文章目录</div>

          <List>
            {this.props.listData.map((item, index) => {
              return (
                <li
                  className={`l${item.depth}`}
                  key={index}
                  onClick={this.onItemClick.bind(this, item.value)}
                >
                  {item.value}
                </li>
              )
            })}
          </List>
        </div>
      </Wrapper>
    )
  }
}
