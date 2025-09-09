const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each'),
}

const MalformedDataError = require('../../src/exceptions/malformedDataError')
const ExceptionMessages = require('./exceptionMessages')

const ContentValidator = function (columnNames) {
  var self = {}
  columnNames = columnNames.map(function (columnName) {
    return columnName.trim()
  })

  self.verifyContent = function () {
    if (columnNames.length === 0) {
      throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT)
    }
  }

  self.verifyHeaders = function () {
    // Check for the presence of the 'entries' node in the JSON structure
    if (columnNames.indexOf('entries') === -1) {
      throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
    }

    // Validate fields within the 'entries' node
    _.each(['name', 'ring', 'quadrant', 'description'], function (field) {
      if (columnNames.indexOf(field) === -1) {
        throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
      }
    })

    // At least one of isNew or status must be present
    if (columnNames.indexOf('isNew') === -1 && columnNames.indexOf('status') === -1) {
      throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
    }
  }

  return self
}

module.exports = ContentValidator
