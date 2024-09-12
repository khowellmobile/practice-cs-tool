/**
 * This file is used as a test to ensure jest is setup correctly and 
 * working for testings
 */
const sum = require('../static/js/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});