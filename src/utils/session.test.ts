import assert from "node:assert/strict";
import { test } from "node:test";

import {
  startSession,
  remainingMs,
  togglePause,
  validMinutes,
  formatRemaining,
} from "./session.ts";

test("uses requested duration and timestamp; catches up after backgrounding", () => {
  const session = startSession(null, 25, 1000, "intent");
  assert.equal(remainingMs(session, 61000), 24 * 60000);
  assert.equal(remainingMs(session, 2000000), 0);
  assert.equal(session.source, "intent");
});

test("repeated start does not reset active or paused timer", () => {
  const session = startSession(null, 25, 1000, "touch");
  assert.equal(startSession(session, 50, 2000, "intent"), session);
  const paused = togglePause(session, 2000);
  assert.equal(startSession(paused, 50, 5000000, "intent"), paused);
});

test("pause, resume and completion", () => {
  const session = startSession(null, 1, 0, "touch");
  const paused = togglePause(session, 10000);
  assert.equal(remainingMs(paused, 999999), 50000);
  const resumed = togglePause(paused, 100000);
  assert.equal(remainingMs(resumed, 110000), 40000);
  assert.equal(remainingMs(resumed, 150001), 0);
  assert.equal(togglePause(resumed, 150001), resumed);
  assert.notEqual(startSession(resumed, 25, 150001, "touch"), resumed);
});

test("rejects invalid durations and formats rounded seconds", () => {
  for (const v of [0, 181, 1.5, "25", null, NaN, Infinity])
    assert.equal(validMinutes(v), false);
  assert.throws(() => startSession(null, 0, 0, "touch"));
  assert.equal(formatRemaining(59999), "01:00");
  assert.equal(formatRemaining(-100), "00:00");
});
