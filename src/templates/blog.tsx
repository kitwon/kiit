import '../styles'

import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

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
interface PropTypes {
  pageContext: any
  data: any
}

const Index = ({ pageContext, data }: PropTypes): ReactElement => {
  // if (!this.props.pageContext.edgesLen) return null
  const { numPages, currentPage } = pageContext
  const { edges } = data.allMarkdownRemark
  const len = { numPages }

  return (
    <div>
      <Header />

      <Wrapper>
        <Container>
          <Row>
            <LeftBar>
              <SideNav />
              <UserPanel len={len} className="user-panel" />
            </LeftBar>

            <RightContent>
              <PostList postEdges={edges || []} />
              <Pagination pageName="blog" {...{ numPages, currentPage }} />
            </RightContent>
          </Row>
        </Container>

        <TopBtn />
        <Footer />
      </Wrapper>
    </div>
  )
}

export default Index

export const PageQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(format: HTML)
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
