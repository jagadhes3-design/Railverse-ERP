'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

process.env.TZ = 'Asia/Kolkata';
const app = fs.readFileSync('app.js', 'utf8');
const enhancements = fs.readFileSync('enhancements.js', 'utf8');

function extract(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, label + ' helper must exist in source');
  return match[0];
}

const appHelper = extract(app, /const dateKey=d=>\x60[\s\S]*?monthNow=\(\)=>today\(\)\.slice\(0,7\);/, 'app date');
const enhancementHelper = extract(enhancements, /const localDateKey=\(d=new Date\(\)\)=>\x60[\s\S]*?\x60;/, 'enhancement local date');
const appDates = vm.runInNewContext(appHelper + '\n({dateKey,today,monthNow})');
const extraDates = vm.runInNewContext(enhancementHelper + '\n({localDateKey})');

function test(name, fn) {
  fn();
  process.stdout.write('PASS ' + name + '\n');
}

test('app formats midnight IST as the correct calendar date', () => {
  assert.equal(appDates.dateKey(new Date(2026, 10, 10, 0, 0)), '2026-11-10');
});
test('app formats late evening IST without moving to the previous UTC date', () => {
  assert.equal(appDates.dateKey(new Date(2026, 10, 9, 23, 59)), '2026-11-09');
});
test('attendance next-day navigation crosses midnight correctly', () => {
  const d = new Date(2026, 10, 9, 0, 0);
  d.setDate(d.getDate() + 1);
  assert.equal(appDates.dateKey(d), '2026-11-10');
});
test('attendance previous-day navigation crosses midnight correctly', () => {
  const d = new Date(2026, 10, 10, 0, 0);
  d.setDate(d.getDate() - 1);
  assert.equal(appDates.dateKey(d), '2026-11-09');
});
test('cashbook local date helper returns the expected date at 01:00 IST', () => {
  assert.equal(extraDates.localDateKey(new Date(2026, 10, 9, 1, 0)), '2026-11-09');
});
test('employee profile date helper handles midnight IST', () => {
  assert.equal(extraDates.localDateKey(new Date(2026, 10, 10, 0, 0)), '2026-11-10');
});
test('weekly employee profile dates advance across month boundary', () => {
  const d = new Date(2026, 9, 31, 0, 0);
  const days = [];
  for (let i = 0; i < 3; i++) {
    const current = new Date(d);
    current.setDate(d.getDate() + i);
    days.push(extraDates.localDateKey(current));
  }
  assert.deepEqual(days, ['2026-10-31', '2026-11-01', '2026-11-02']);
});
test('attendance navigation is wired to local date formatter', () => {
  assert.match(app, /d\.setDate\(d\.getDate\(\)\+delta\);\$\('attQuickDate'\)\.value=dateKey\(d\);/);
});
test('cashbook and employee profile use local date helper', () => {
  assert.ok(enhancements.includes("$('rv-cash-date').value=localDateKey()"));
  assert.ok(enhancements.includes("$('rv-focus-date').value=localDateKey(now)"));
  assert.ok(enhancements.includes("$('rv-focus-date').value=localDateKey(d)"));
});
test('date-only ISO slicing regression is absent from both files', () => {
  assert.doesNotMatch(app, /toISOString\(\)\.slice\(0,\s*(10|7)\)/);
  assert.doesNotMatch(enhancements, /toISOString\(\)\.slice\(0,\s*(10|7)\)/);
});
process.stdout.write('All 10 IST date regression tests passed. TZ=' + process.env.TZ + '\n');
