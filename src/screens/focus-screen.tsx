import { Button, Column, Host, Picker, Text as NativeText } from "@expo/ui";
import { isAvailable } from "expo-app-intents";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { FocusOrbit } from "@/components/focus-orbit";
import { useFocusSession } from "@/hooks/use-focus-session";
import { formatRemaining } from "@/utils/session";

const ink = "#101A18";
const muted = "#99ABA2";
const cream = "#F1F4E8";
const lime = "#D8F798";

const sessionCopy = {
  idle: {
    title: "Make a little room.",
    subtitle: "A quiet session, just a few words away.",
    timerLabel: "YOUR NEXT SESSION",
    accessibilityLabel: "Duration",
    encouragement: "Start whenever you’re ready",
    action: "Start focusing",
  },
  running: {
    title: "One thing at a time.",
    subtitle: "You’re here. That’s a good start.",
    timerLabel: "IN THE MOMENT",
    accessibilityLabel: "Remaining",
    encouragement: "Stay with it",
    action: "Pause session",
  },
  paused: {
    title: "Take a breath.",
    subtitle: "Your session is waiting for you.",
    timerLabel: "ON PAUSE",
    accessibilityLabel: "Paused",
    encouragement: "No rush",
    action: "Resume session",
  },
  finished: {
    title: "Nice work.",
    subtitle: "A little space. A little progress.",
    timerLabel: "SESSION COMPLETE",
    accessibilityLabel: "Complete",
    encouragement: "Time for a break",
    action: "Start focusing",
  },
};

export default function FocusScreen() {
  const {
    session,
    minutes,
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
  } = useFocusSession();

  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const size = Math.min(width - 56, 280);

  let copy = sessionCopy.idle;

  if (finished) {
    copy = sessionCopy.finished;
  } else if (paused) {
    copy = sessionCopy.paused;
  } else if (active) {
    copy = sessionCopy.running;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: ink }}
      contentContainerStyle={{
        paddingHorizontal: 28,
        paddingTop: 16,
        paddingBottom: 40,
        gap: 26,
        alignItems: "stretch",
      }}
    >
      <View style={{ gap: 8, minHeight: 105 }}>
        <Text
          style={{
            color: lime,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 3,
          }}
        >
          LESS NOISE. MORE FOCUS.
        </Text>

        <Text
          style={{
            color: cream,
            fontSize: 30,
            fontWeight: "500",
            letterSpacing: -1,
          }}
        >
          {copy.title}
        </Text>

        <Text style={{ color: muted, fontSize: 16, lineHeight: 23 }}>
          {copy.subtitle}
        </Text>
      </View>

      <View
        style={{
          alignSelf: "center",
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        }}
        accessible
        accessibilityLabel={`${copy.accessibilityLabel} ${formatRemaining(left)}`}
      >
        <FocusOrbit
          size={size}
          running={active && !paused}
          progress={progress}
        />

        <Text
          style={{
            color: muted,
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 3,
            marginBottom: 10,
          }}
        >
          {copy.timerLabel}
        </Text>

        <Text
          selectable
          style={{
            color: cream,
            fontSize: 64,
            fontWeight: "300",
            fontVariant: ["tabular-nums"],
            letterSpacing: -3,
          }}
        >
          {formatRemaining(left)}
        </Text>

        <Animated.View
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            opacity: active ? 1 : 0.5,
            transitionProperty: "opacity",
            transitionDuration: reduced ? 0 : 180,
          }}
        >
          <View
            style={{
              height: 5,
              width: 5,
              borderRadius: 3,
              backgroundColor: lime,
            }}
          />

          <Text style={{ color: muted, fontSize: 12 }}>
            {copy.encouragement}
          </Text>
        </Animated.View>
      </View>

      <View style={{ gap: 16 }}>
        <View style={{ height: 40 }} pointerEvents={active ? "none" : "auto"}>
          <Host matchContents colorScheme="dark" seedColor={lime}>
            <Picker
              enabled={!active}
              selectedValue={minutes}
              onValueChange={(value) => {
                if (!active) setMinutes(value);
              }}
              accessibilityLabel="Session length"
            >
              <Picker.Item label="1 minute · quick demo" value={1} />
              <Picker.Item label="15 minutes · a small step" value={15} />
              <Picker.Item label="25 minutes · find your flow" value={25} />
              <Picker.Item label="50 minutes · go a little deeper" value={50} />
            </Picker>
          </Host>
        </View>

        <Host
          matchContents
          colorScheme="dark"
          seedColor={lime}
          style={{ width: "100%" }}
        >
          <Column spacing={10} alignment="center">
            <Button
              testID="primary-action"
              style={{ width: "100%", height: 54 }}
              onPress={onPrimary}
            >
              <NativeText
                textStyle={{
                  color: ink,
                  fontSize: 17,
                  fontWeight: "600",
                  textAlign: "center",
                }}
                style={{
                  width: Math.max(180, width - 100),
                  paddingVertical: 10,
                }}
              >
                {copy.action}
              </NativeText>
            </Button>

            <Button
              disabled={!active}
              testID="end-session"
              variant="text"
              onPress={onEnd}
              label="End session"
            />
          </Column>
        </Host>
      </View>

      {isAvailable() && (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#2B3931",
            paddingTop: 22,
            gap: 10,
          }}
        >
          <Text
            style={{
              color: lime,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 2,
            }}
          >
            JUST ASK SIRI
          </Text>

          <Text
            selectable
            style={{ color: cream, fontSize: 20, lineHeight: 28 }}
          >
            “Start a focus session in Still”
          </Text>

          <Text style={{ color: muted, fontSize: 13, lineHeight: 20 }}>
            Starts a 25-minute session. You can also choose a duration in
            Shortcuts. An active session won’t be restarted.
          </Text>

          <Text style={{ color: lime, fontSize: 12, minHeight: 16 }}>
            {receipt ??
              (session?.source === "intent" ? "Started with App Intent" : " ")}
          </Text>
        </View>
      )}

      {error && (
        <Text selectable accessibilityRole="alert" style={{ color: "#FFB3A4" }}>
          Couldn’t handle this action: {error}
        </Text>
      )}

      <Text style={{ color: "#66776D", fontSize: 11, textAlign: "center" }}>
        BUILT WITH EXPO · APP INTENTS
      </Text>
    </ScrollView>
  );
}
