const classOf = (o) => Object.prototype.toString.call(o).slice(8, -1)

module.exports = classOf;
