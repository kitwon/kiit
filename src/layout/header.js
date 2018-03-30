import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  padding: 0;
  overflow: hidden;
`

const Background = styled.div`
  position: relative;
  z-index: 1;
  padding-top: ${470 / 1920 * 100}%;
  background-image: url(http://kiit-1253813979.file.myqcloud.com/header.jpg);
  background-size: 100%;
  background-position: top;
  background-repeat: no-repeat;
`

const TextWrapper = styled.div`
  position: absolute;
  z-index: 2;
  width: 660px;
  left: 50%;
  top: 50%;
  margin-top: -112px;
  margin-left: -${660 / 2}px;
  text-align: right;
  color: #fff;
  line-height: 1.5;
  font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
`

const FirstText = styled.p`
  margin: 0;
  font-size: 80px;
  line-height: 1.2;
  font-weight: 700;
  font-style: italic;
`

const SecondText = styled.p`
  margin: 0;
  font-size: 32px;
  font-style: italic;
`

const ThirdText = styled.div`
  font-family: Roboto Slab,Monda,PingFang SC,Microsoft YaHei,sans-serif;
  display: inline-block;
  margin-top: 15px;
  padding: 0 24px;
  font-size: 32px;
  letter-spacing: 1.5px;
  background: #093848;
`

class Header extends React.Component {
  render() {
    return (
      <Wrapper>
        <TextWrapper>
          <FirstText>hi Babe</FirstText>
          <SecondText>look at this kingdom. i conquered for thee.</SecondText>
          <ThirdText>kit's note</ThirdText>
        </TextWrapper>

        <Background />
      </Wrapper>
    )
  }
}

export default Header
