const classOf = require('./classOf');

const isPrmitive = (o) => ['Number', 'String', 'Symbol', 'Boolean', 'Null', 'Undefined'].includes(classOf(o));

module.exports = isPrmitive;
