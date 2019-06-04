import React from 'react'
import styled from 'styled-components'
import { throttle } from 'lodash'
import getRaf from '../utils/raf'
const requestFrame = getRaf()

const Wrapper = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  margin-left: ${960 / 2 + 30}px;
  z-index: 99;
  text-align: center;
  font-size: 14px;
  font-weight: bold;

  > * {
    cursor: pointer;
    transition: all .3s;
    display: block;
    color: #1993ad;

    &:hover {
        color: #47c9e5;
    }
  }

  i {
    position: relative;
    font-size: 20px;
    bottom: -1px;
    margin-right: 2px;
  }
}
`

const TopButton = styled.div`
  transition: all .3s $cubic;
  transform: translate3d(0, ${props => props.active ? 0 : 130}px, 0);
`

interface PropTypes {
  delay: number
}

export default class TopBtn extends React.Component<PropTypes> {
  constructor(props) {
    super(props)

    this.state = {
      docHeight: 0,
      pagePercent: 0,
      showTopBtn: false,
      scrollListener: null
    }

    this.goPageTop = this.goPageTop.bind(this)
  }

  getScrollCount() {
    const doc = document.documentElement
    let scrollTop = doc.scrollTop - doc.clientTop
    let percentage = Math.floor((scrollTop / this.state.docHeight).toFixed(3) * 100)

    this.setState({
      pagePercent: percentage > 100 ? 100 : percentage,
      showTopBtn: scrollTop > 200
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        docHeight: document.body.scrollHeight - window.screen.availHeight,
        scrollListener: throttle(this.getScrollCount.bind(this), 180)
        // docHeight: document.documentElement.scrollHeight
      })
      this.getScrollCount()

      window.addEventListener('scroll', this.state.scrollListener, {
        passive: true
      })
    }, this.props.delay || 0)
  }

  componentWillUnmount() {
    console.log(this.scrollListener)
    window.removeEventListener('scroll', this.state.scrollListener.cancel)
  }

  goPageTop() {
    document.documentElement.scrollTop -= 350
    if (document.documentElement.scrollTop > 0) requestFrame(this.goPageTop)
  }

  render() {
    const { showTopBtn, pagePercent } = this.state
    return (
      <Wrapper>
        <TopButton
          active={showTopBtn}
          onClick={this.goPageTop}
        >
          <i className="ion-arrow-up-c" />
          {pagePercent}%
        </TopButton>
      </Wrapper>
    )
  }
}
