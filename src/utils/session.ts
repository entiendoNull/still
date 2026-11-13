export type Session = {
  startedAt: number;
  endsAt: number;
  durationMs: number;
  pausedRemaining: number | null;
  source: "touch" | "intent";
};

export function validMinutes(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 180
  );
}

export function remainingMs(session: Session, now: number): number {
  return Math.max(0, session.pausedRemaining ?? session.endsAt - now);
}

export function startSession(
  previous: Session | null,
  minutes: number,
  now: number,
  source: Session["source"],
): Session {
  if (!validMinutes(minutes)) {
    throw new Error("Choose a whole number of minutes from 1 to 180.");
  }

  // A repeated start never silently resets an active session, including a paused one.
  if (previous && remainingMs(previous, now) > 0) {
    return previous;
  }

  return {
    startedAt: now,
    endsAt: now + minutes * 60000,
    durationMs: minutes * 60000,
    pausedRemaining: null,
    source,
  };
}

export function togglePause(session: Session, now: number): Session {
  if (remainingMs(session, now) === 0) {
    return session;
  }

  if (session.pausedRemaining === null) {
    return { ...session, pausedRemaining: remainingMs(session, now) };
  }

  return {
    ...session,
    endsAt: now + session.pausedRemaining,
    pausedRemaining: null,
  };
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
