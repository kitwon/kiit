import React from "react";
import styled from 'styled-components';

import HeadList from '../components/post/HeadList';
import TopBtn from '../components/TopBtn';
import SideNav from '../components/SideNav';
import Pagination from '../components/post/Pagination';

import Footer from '../layout/Footer';

const Wrapper = styled.div`
  width: 960px;
  margin: 0 auto;
  color: #5a5f61;
  line-height: 2;

  img {
    max-width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 40px;
    margin-bottom: 25px;
  }

  h1 {
    margin-top: 60px;
  }
`
const Row = styled.div`
  display: flex;
  margin: 0 -15px;
`
const LeftCol = styled.div`
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;

  #leftCover {
    padding-top: 60px;
  }
`
const RightCol = styled.div`
  flex: 0 0 75%;
  max-width: 75%;
  padding: 50px 15px 150px 55px;
`
const PostHeader = styled.div`
  text-align: center;
  font-weight: 400;
  font-size: 1.55rem;
`
const InfoWrap = styled.div`
  margin-top: 5px;
  margin-bottom: 80px;
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
`;

const Copyright = styled.ul`
  padding: 10px 10px 10px 20px;
  margin: 50px 0 0;
  list-style: none;
  color: #666;
  border-left: .25rem solid #f0ad4e;
  background: #fbfcfc;
  font-size: 14px;

  a {
    color: inherit;
    text-decoration: underline;

    &:hover {
      color: #333;
    }
  }

  .title {
    display: inline-block;
    font-weight: bold;
    margin-right: 1em;
  }
`

function escape2Html(str) {
  var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

export default class PostDetail extends React.Component {
  componentDidMount() {
    for (let i = 1; i <= 5; i++) {
      let el = document.getElementsByTagName(`h${i}`);

      for (let j = 0; j < el.length; j++) {
        el[j].setAttribute('id', escape2Html(el[j].innerHTML));
        el[j].dataset.offset = el[j].offsetTop;
      }
    }

    const leftCover = document.getElementById('leftCover');
    leftCover.style.width = `${leftCover.offsetWidth}px`;
    leftCover.style.position = 'fixed';
    leftCover.style.top = 0;
    leftCover.style.left = leftCover.offsetLeft;
  }

  render() {
    if (!this.props.data.markdownRemark) return null;

    const { headings, html, frontmatter} = this.props.data.markdownRemark;
    const { title, date, category } = frontmatter;
    const { pathContext } = this.props;
    const postPath = `http://kiit.wang${this.props.location.pathname}`;

    return (
      <Wrapper>
        <Row>
          <LeftCol>
            <div id="leftCover">
              <SideNav />
              <HeadList listData={headings} />
            </div>
          </LeftCol>
          <RightCol>
            <PostHeader>{ title }</PostHeader>
            <InfoWrap>
              <InfoItem>
                <i className="ion-android-calendar" />
                <span>发表于 {date}</span>
              </InfoItem>
              <InfoItem>
                <i className="ion-android-folder-open" />
                <span>发表于 {category}</span>
              </InfoItem>
            </InfoWrap>
            <div dangerouslySetInnerHTML={{__html: html}} />
            <Copyright>
              <li>
                <span className="title">本文作者: </span>
                <span>Kitwang Chen</span>
              </li>
              <li>
                <span className="title">本文链接: </span>
                <span><a href={postPath}>{postPath}</a></span>
              </li>
              <li>
                <span className="title">版权声明: </span>
                <span>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/">CC BY-NC-SA 3.0 CN</a> 许可协议。转载请注明出处！</span>
              </li>
            </Copyright>
            <Pagination prev={pathContext.prev} next={pathContext.next} />
          </RightCol>
        </Row>
        <Footer className="post-footer" />
        <TopBtn delay={2000}/>
      </Wrapper>
    );
  }
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      },
      headings {
        depth
        value
      },
    }
  }
`
