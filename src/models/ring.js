
const Ring = function ({ name, order, description }) {
  var self = {}

  self.name = function () {
    return name
  }

  self.order = function () {
    return order
  }

  self.description = function () {
    return description
  }

  return self
}

module.exports = Ring
