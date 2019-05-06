const O = Object.prototype.toString;
const T = v => O.call(v).slice(8, -1);
const TT = (a, b) => (a = T(a), a === T(b) ? a : '*');

const isNil = v => v === null || v === undefined;
const isInvalid = v => isNil(v) || (typeof(v) === 'number' && isNaN(v));
const equalArray = (a, b) => a.length === b.length && a.every((v, i) => b[i] === v);

module.exports = { O, T, TT, isNil, isInvalid, equalArray };