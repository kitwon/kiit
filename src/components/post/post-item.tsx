import React, { FunctionComponentElement } from 'react'
import styled from 'styled-components'

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
`

const Header = styled.p`
  font-weight: 400;
  font-size: 26px;
  text-align: center;
  margin: 0;
`

const InfoWrap = styled.div`
  margin-top: 5px;
  /* font-style: 13px; */
  color: #6b7174;
  text-align: center;

  .excerpt {
    text-align: left;
    margin: 60px 0 50px;
  }
`

const InfoItem = styled.div`
  position: relative;
  display: inline-block;
  padding: 0 10px;
  vertical-align: middle;
  font-size: 13px;

  i {
    position: relative;
    bottom: -1px;
    margin-right: 3px;
    font-size: 16px;
  }

  &:first-child {
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -.4em;
      height: 1em;
      border-right: 1px solid #9ea4a6;
    }
  }
`

interface Props {
  postData: any
}

const PostItem = ({ postData }: Props): FunctionComponentElement<Props> => {
  const data = postData.frontmatter
  return (
    <Wrapper>
      <Header><a href={data.path}>{data.title}</a></Header>

      <InfoWrap>
        <InfoItem>
          <i className="ion-android-calendar" />
          <span>{`发表于 ${data.date}`}</span>
        </InfoItem>
        <InfoItem>
          <i className="ion-android-folder-open" />
          <span>{`发表于 ${data.category}`}</span>
        </InfoItem>
        <div className="excerpt" dangerouslySetInnerHTML={{ __html: postData.excerpt }} />
      </InfoWrap>
    </Wrapper>
  )
}

export default PostItem
