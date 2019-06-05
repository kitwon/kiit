import React, { FunctionComponentElement, ReactElement } from 'react'
import styled from 'styled-components'
// import Archive from 'src/templates/archive';

const Wrapper = styled.div`
  position: relative;
  padding-left: 30px;

  &:after {
    content: "";
    position: absolute;
    z-index: 1;
    left: 26px;
    top: 0;
    bottom: -20px;
    width: 4px;
    background: #eeefef;
  }
`

const ArchiveItem = styled.div`
  padding-left: 30px;
  z-index: 2;
  position: relative;

  .time {
    vertical-align: middle;
    color: #848a8e;
    font-size: 12px;
    margin-right: 8px;
  }

  a {
    vertical-align: middle;
    color: #6b7174;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    border-radius: 50%;
    background: #d4d6d7;
  }
`

const ArchiveYear = styled(ArchiveItem)`
  font-size: 22px;
  color: #5e6467;
  margin: 25px 0 50px;

  &:after {
    left: -7px;
    margin-top: -5px;
    width: 10px;
    height: 10px;
  }
`

const ArchivePost = styled(ArchiveItem)`
  padding-top: 33px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #b9bdbf;

  &:after {
    left: -6px;
    top: 33.33333px;
    margin-top: 8px;
    width: 8px;
    height: 8px;
  }
`

interface Props {
  listData: any
}

const ArchiveList = ({ listData }: Props): FunctionComponentElement<Props> => {
  let tempYear: any = null
  const tempArr: ReactElement[] = []

  listData.forEach((data: any): void => {
    const { date, path, title } = data.node.frontmatter
    const year = date.substring(0, 4)

    if (tempYear !== year) {
      tempYear = year
      tempArr.push(<ArchiveYear key={year}>{year}</ArchiveYear>)
    }

    tempArr.push(
      <ArchivePost key={data.name}>
        <span className="time">{date}</span>
        <a href={path}>{title}</a>
      </ArchivePost>
    )
  })

  return <Wrapper>{tempArr}</Wrapper>
}

export default ArchiveList
