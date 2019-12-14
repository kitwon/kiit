import React, { FunctionComponentElement } from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Header from '../layout/header'
import Footer from '../layout/Footer'
import { Wrapper, Container } from '../layout/container'
import SideNav from '../components/SideNav'
import UserPanel from '../components/UserPanel'
import Pagination from '../components/Pagination'
import ArchiveList from '../components/ArchiveList'
import PostDefaultData from '../types/post';

import '../styles'

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

  .archive-pagination {
    margin-top: 130px;
  }
`

const Archive = ({ pageContext, data }: PostDefaultData): FunctionComponentElement<PostDefaultData> => {
  // console.log(this.props);
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
              <ArchiveList listData={edges || []} />
              <Pagination
                className="archive-pagination"
                pageName="archive"
                numPages={numPages}
                currentPage={currentPage}
              />
            </RightContent>
          </Row>
        </Container>

        <Footer />
      </Wrapper>
    </div>
  )
}

export default Archive

export const pageQuery = graphql`
  query ArchiveQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
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
