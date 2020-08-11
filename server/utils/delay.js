const delay = (ms) => {
  return new Promise((onResolve, _) => {
    if (typeof ms === 'number' && ms > 0) {
      setTimeout(() => onResolve('done'), ms);
    } else {
      onResolve('done');
    }
  })
};

module.exports = delay;
