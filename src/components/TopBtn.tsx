import React, { ReactElement } from 'react'
import classNames from 'classnames'
import { throttle } from 'lodash'
import getRaf from '../utils/raf'
import './top-btn.scss';

const requestFrame = getRaf()

interface PropTypes {
  delay?: number
}

interface States {
  docHeight: number
  pagePercent: number
  showTopBtn: boolean
  scrollListener: any
}

export default class TopBtn extends React.Component<PropTypes, States> {
  constructor(props: PropTypes) {
    super(props)

    this.state = {
      docHeight: 0,
      pagePercent: 0,
      showTopBtn: false,
      scrollListener: null
    }

    this.goPageTop = this.goPageTop.bind(this)
  }

  componentDidMount(): void {
    const { delay } = this.props;

    setTimeout((): void => {
      this.setState({
        docHeight: document.body.scrollHeight - window.screen.availHeight,
        scrollListener: throttle(this.getScrollCount.bind(this), 180)
        // docHeight: document.documentElement.scrollHeight
      })
      this.getScrollCount()

      const { scrollListener } = this.state;
      window.addEventListener('scroll', scrollListener, {
        passive: true
      })
    }, delay || 0)
  }

  componentWillUnmount(): void {
    const { scrollListener } = this.state;
    if (scrollListener.cancel)
      window.removeEventListener('scroll', scrollListener.cancel)
  }

  getScrollCount(): void {
    const { docHeight } = this.state;
    const doc = document.documentElement
    const scrollTop: number = doc.scrollTop - doc.clientTop
    const percentage = Number(Math.floor((scrollTop / docHeight) * 100).toFixed(3))

    this.setState({
      pagePercent: percentage > 100 ? 100 : percentage,
      showTopBtn: scrollTop > 200
    })
  }

  goPageTop(): void {
    document.documentElement.scrollTop -= 350
    if (document.documentElement.scrollTop > 0) requestFrame(this.goPageTop)
  }

  render(): ReactElement {
    const { showTopBtn, pagePercent } = this.state
    const classes = classNames({
      'top-btn': true,
      'is-active': showTopBtn
    })

    return (
      <div className="top-btn-wrap">
        <div
          role="button"
          tabIndex={0}
          className={classes}
          onClick={this.goPageTop}
          onKeyDown={this.goPageTop}
        >
          <i className="ion-arrow-up-c" />
          {`${pagePercent}%`}
        </div>
      </div>
    )
  }
}
