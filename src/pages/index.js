import React from 'react';
import styled from 'styled-components';

import Header from '../layout/header';
import Footer from '../layout/footer';
import { Wrapper, Container } from '../layout/container';
import SideNav from '../components/SideNav';
import UserPanel from '../components/UserPanel';
import PostList from '../components/post/post-list';

import '../styles';

const Row = styled.div`
  display: flex;
  margin: 0 -15px;
`;

const LeftBar = styled.div`
  position: relative;
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;

  .user-panel {
    margin-top: 20px;
  }
`;

const RightContent = styled.div`
  position: relative;
  flex: 0 0 75%;
  max-width: 75%:
  padding: 0 15px;
`;

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Header />

        <Wrapper>
          <Container>
            <Row>
              <LeftBar>
                <SideNav />
                <UserPanel className="user-panel"/>
              </LeftBar>

              <RightContent>
                <PostList />
              </RightContent>
            </Row>
          </Container>

          <Footer />
        </Wrapper>
      </div>
    );
  }
}
