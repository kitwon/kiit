import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  padding: 40px;
  color: #5a5f61;
  line-height: 2;
  transition: all .3s;

  a {
    color: inherit;
  }

  &:hover {
    box-shadow: 0 0 18px #e9eaeb;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 20%;
    left: 50%;
    margin-left: -10%;
    border-bottom: 1px solid #d4d6d7;
  }
`;

const Header = styled.p`
  font-weight: 400;
  font-size: 26px;
  text-align: center;
`;

const InfoWrap = styled.div`
  margin-top: 5px;
  /* font-style: 13px; */
  color: #6b7174;
  text-align: center;

  .excerpt {
    text-align: left;
    margin: 60px 0 50px;
  }
`;

const InfoItem = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 10px;
  vertical-align: middle;
`;

const ReadMoreBtn = styled.a`
    display: block;
    padding: 6px 0;
    width: 8em;
    margin: 0 auto;
    border: 2px solid #525759;
    text-align: center;
    line-height: 1;
    font-size: 15px;
    transition: all .3s;

    &:hover {
      background: #525759;
    }
`;

export default class PostItem extends React.Component {
  render() {
    return (
      <Wrapper>
        <Header><a href="">构建60fps-web-app</a></Header>

        <InfoWrap>
          <InfoItem>
            <i className="ion-android-calendar" />
            <span>发表于 2017年9月13日</span>
          </InfoItem>
          <InfoItem>
            <i className="ion-android-calendar" />
            <span>发表于 2017年9月13日</span>
          </InfoItem>
          <div className="excerpt">tsetaetasdfasfsefassdfasef</div>

        </InfoWrap>
      </Wrapper>
    )
  }
}

// export const pageQuery = graphql`

// `;
