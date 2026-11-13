import * as AppIntents from "expo-app-intents";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";

import {
  remainingMs,
  startSession,
  togglePause,
  validMinutes,
  type Session,
} from "@/utils/session";

export function useFocusSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [minutes, setMinutes] = useState(25);
  const [now, setNow] = useState(() => Date.now());
  const [receipt, setReceipt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handledIds = useRef(new Set<string>());

  // Expo delivers queued invocations on mount and live invocations afterward.
  AppIntents.useAppIntents(async (pendingIntents) => {
    setError(null);

    for (const intent of pendingIntents) {
      try {
        if (!handledIds.current.has(intent.id)) {
          if (
            intent.name === "startFocus" &&
            validMinutes(intent.params.minutes)
          ) {
            const duration = intent.params.minutes;
            const time = Date.now();

            setSession((previous) =>
              startSession(previous, duration, time, "intent"),
            );
            setMinutes(duration);
            setReceipt("Started with Siri / Shortcuts");
          } else if (intent.name === "stopFocus") {
            setSession(null);
            setReceipt("Ended with Siri / Shortcuts");
          } else {
            setError(`Unsupported App Intent: ${intent.name}`);
          }

          handledIds.current.add(intent.id);
          setNow(Date.now());
        }

        await AppIntents.removePendingInvocationAsync(intent.id);
      } catch (error) {
        setError(String(error));
        break;
      }
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);

    return () => clearInterval(timer);
  }, []);

  const left = session ? remainingMs(session, now) : minutes * 60000;
  const finished = session !== null && left === 0;
  const active = session !== null && !finished;
  const paused = active && session.pausedRemaining !== null;
  const progress = session ? 1 - left / session.durationMs : 0;

  function onPrimary() {
    const time = Date.now();

    setSession((previous) =>
      previous && remainingMs(previous, time) > 0
        ? togglePause(previous, time)
        : startSession(previous, minutes, time, "touch"),
    );
    setNow(time);
    setReceipt(null);
    setError(null);

    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function onEnd() {
    setSession(null);
    setReceipt(null);
    setError(null);
  }

  return {
    session,
    minutes: active ? session.durationMs / 60000 : minutes,
    setMinutes,
    receipt,
    error,
    left,
    finished,
    active,
    paused,
    progress,
    onPrimary,
    onEnd,
  };
}
