import React from 'react'
import styled from 'styled-components'

import HeadImg from '../images/head.jpeg'

const Wrapper = styled.div`
  display: block;
  padding: 30px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e1e2e3;
  line-height: 1.5;
  color: #666c6f;
`

const Image = styled.div`
  width: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;

  img {
    vertical-align: top;
    width: 100%;
  }
`

const UserWrap = styled.div`
  text-align: center;

  .name {
    font-size: 20px;
    font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
  }
`

const InfoWrap = styled.div`
  margin: 20px 0 0;
  line-height: 1.2;
  font-size: 13px;
  text-align: center;

  > div {
    display: inline-block;
    text-align: center;
    padding: 0 1em;
  }

  .num {
    font-size: 19px;
    font-weight: 700;
    font-style: normal;
  }

  .m {
    border-left: 1px solid #9ea4a6;
    border-right: 1px solid #9ea4a6;
  }
`

interface PropTypes {
  className: string
  len: any
}

const UserPanel = ({ len, className }: PropTypes): any => {
  if (!len) return null
  const { edgesLen, tagsLen, categoryLen } = len

  return (
    <Wrapper className={className}>
      <Image><img src={HeadImg} alt="kit" /></Image>

      <UserWrap>
        <div className="name">kitwang chen</div>
        <div style={{ fontSize: '14px', color: '#848a8e' }}>frontend/UI designer</div>
      </UserWrap>

      <InfoWrap>
        <div>
          <div className="num">{edgesLen}</div>
          <div>日志</div>
        </div>
        <div className="m">
          <div className="num">{categoryLen}</div>
          <div>分类</div>
        </div>
        <div>
          <div className="num">{tagsLen}</div>
          <div>标签</div>
        </div>
      </InfoWrap>
    </Wrapper>
  )
}

export default UserPanel
