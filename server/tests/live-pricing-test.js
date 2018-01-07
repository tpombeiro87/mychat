/* global describe before it beforeEach */
const chai = require('chai')
const expect = chai.expect

describe('Testing', () => {
  before(() => {
  })

  beforeEach(() => {
  })

  describe('Some test..', () => {
    before(done => {})

    it('Should do something', () => {
      expect(true).to.be.equal(true)
    })
  })
})
