const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each'),
}

const MalformedDataError = require('../../src/exceptions/malformedDataError')
const ExceptionMessages = require('./exceptionMessages')

const ContentValidator = function (jsonData) {
  var self = {}

  self.verifyContent = function () {
    if (!jsonData.entries || !Array.isArray(jsonData.entries)) {
      throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT)
    }
  }

  self.verifyHeaders = function () {
    // Validate fields within each entry in the 'entries' node
    jsonData.entries.forEach(entry => {
      ['title', 'description', 'quadrant', 'timeline', 'url', 'key'].forEach(field => {
        if (!entry.hasOwnProperty(field)) {
          throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
        }
      })

      // Validate fields within each timeline node
      if (!Array.isArray(entry.timeline)) {
        throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
      }

      entry.timeline.forEach(timeline => {
        ['moved', 'ringId', 'date', 'description'].forEach(field => {
          if (!timeline.hasOwnProperty(field)) {
            throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
          }
        })
      })
    })
  }

  return self
}

module.exports = ContentValidator
