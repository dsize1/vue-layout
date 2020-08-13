/**
 * @description: 
 * @param {number} 延迟时间（ms） 
 * @return {promise} 
 */
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
