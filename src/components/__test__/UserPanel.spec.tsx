import React from 'react'
import renderer from 'react-test-renderer'
import UserPanel from '../UserPanel'

describe('UserPanel', () => {
  it("renders correctly", () => {
    const tree = renderer.create(<UserPanel len={5} className="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
