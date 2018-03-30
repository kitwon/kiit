import '../styles'

import React from 'react'
import styled from 'styled-components'

import Header from '../layout/header'
import Footer from '../layout/Footer'
import { Wrapper, Container } from '../layout/container'
import SideNav from '../components/SideNav'
import UserPanel from '../components/UserPanel'
import PostList from '../components/post/post-list'
import Pagination from '../components/Pagination'
import TopBtn from '../components/TopBtn'

const Row = styled.div`
  display: flex;
  margin: 0 -15px;
`

const LeftBar = styled.div`
  position: relative;
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;

  .user-panel {
    margin-top: 20px;
  }
`

const RightContent = styled.div`
  position: relative;
  flex: 0 0 75%;
  max-width: 75%;
  padding: 0 15px;
`

export default class Index extends React.Component {
  render() {
    if (!this.props.pathContext.edgesLen) return null
    const { nodes, next, prev, page, pages, total, tagsLen, edgesLen, categoryLen } = this.props.pathContext
    const len = { edgesLen, tagsLen, categoryLen }

    return (
      <div>
        <Header />

        <Wrapper>
          <Container>
            <Row>
              <LeftBar>
                <SideNav />
                <UserPanel len={len} className="user-panel"/>
              </LeftBar>

              <RightContent>
                <PostList postEdges={nodes || []}/>
                <Pagination {...{next, prev, pages, total, page}}></Pagination>
              </RightContent>
            </Row>
          </Container>

          <TopBtn />
          <Footer />
        </Wrapper>
      </div>
    )
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            category
            path
          }
        }
      }
    }
  }
`
