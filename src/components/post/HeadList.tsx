import React, { ReactElement } from 'react';
import styled from 'styled-components';

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
`;

const List = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;

  span {
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
`;

interface Props {
  listData: any
}

function scrollToPos(pos: number): void {
  document.documentElement.scrollTop = pos - 50;
  // if (document.documentElement.scrollTop > pos) requestFrame(this.goPageTop);
}

export default class TitleList extends React.Component<Props> {
  // eslint-disable-next-line class-methods-use-this
  onItemClick(id: string): void {
    const pos = document.getElementById(id) as HTMLElement
    scrollToPos(pos.offsetTop)
  }


  render(): ReactElement {
    const { listData } = this.props;
    return (
      <Wrapper>
        <div>
          <div className="title">文章目录</div>

          <List>
            {listData.map((item: any): ReactElement => (
              <div
                className={`l${item.depth}`}
                key={item.value}
                role="button"
                tabIndex={0}
                onClick={(): void => this.onItemClick(item.value)}
                onKeyDown={(): void => this.onItemClick(item.value)}
              >
                {item.value}
              </div>
              ))}
          </List>
        </div>
      </Wrapper>
    );
  }
}
