import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// The halo extends beyond the dial. Give its blur real drawing space, not just overflow.
const glowPadding = 64;

type Props = {
  size: number;
  running: boolean;
  progress: number;
};

/** All motion is canvas-only: no animated layout or JS-frame callbacks. */
export function FocusOrbit({ size, running, progress }: Props) {
  const reduced = useReducedMotion();
  const phase = useSharedValue(0);
  const energy = useSharedValue(0);
  const fill = useSharedValue(0);

  const canvasSize = size + glowPadding * 2;
  const center = canvasSize / 2;
  const radius = size / 2 - 24;
  const ring = Skia.Path.Circle(center, center, radius);

  useEffect(() => {
    energy.set(withTiming(running ? 1 : 0, { duration: reduced ? 0 : 700 }));

    if (running && !reduced) {
      phase.set(
        withRepeat(
          withTiming(phase.get() + Math.PI * 20, {
            duration: 140000,
            easing: Easing.linear,
          }),
          -1,
        ),
      );
    } else {
      cancelAnimation(phase);
    }

    return () => cancelAnimation(phase);
  }, [running, reduced, phase, energy]);

  useEffect(() => {
    fill.set(withTiming(progress, { duration: reduced ? 0 : 250 }));
  }, [progress, reduced, fill]);

  const rotation = useDerivedValue(() => [{ rotate: phase.get() }]);
  const counter = useDerivedValue(() => [{ rotate: -phase.get() * 0.7 }]);
  const glow = useDerivedValue(
    () => 0.12 + energy.get() * (0.2 + 0.08 * Math.sin(phase.get() * 3)),
  );
  const haloRadius = useDerivedValue(
    () => radius - 9 + energy.get() * (4 + 3 * Math.sin(phase.get() * 2)),
  );
  const orbitOpacity = useDerivedValue(() => 0.18 + energy.get() * 0.82);

  return (
    <Canvas
      style={[styles.canvas, { width: canvasSize, height: canvasSize }]}
      pointerEvents="none"
    >
      <Circle cx={center} cy={center} r={radius - 3} color="#15251F" />
      <Circle
        cx={center}
        cy={center}
        r={haloRadius}
        color="#C6FF87"
        style="stroke"
        strokeWidth={12}
        opacity={glow}
      >
        <BlurMask blur={18} style="normal" />
      </Circle>

      <Circle
        cx={center}
        cy={center}
        r={radius}
        color="#3A5040"
        style="stroke"
        strokeWidth={1}
      />
      {Array.from({ length: 60 }, (_, i) => {
        const angle = (i * Math.PI) / 30;
        const tickPath = Skia.Path.Line(
          {
            x: center + (radius - 10) * Math.sin(angle),
            y: center - (radius - 10) * Math.cos(angle),
          },
          {
            x: center + (radius - (i % 5 === 0 ? 18 : 14)) * Math.sin(angle),
            y: center - (radius - (i % 5 === 0 ? 18 : 14)) * Math.cos(angle),
          },
        );

        return (
          <Path
            key={i}
            path={tickPath}
            color={i % 5 === 0 ? "#829365" : "#354B39"}
            style="stroke"
            strokeWidth={1}
          />
        );
      })}
      <Group
        origin={{ x: center, y: center }}
        transform={rotation}
        opacity={orbitOpacity}
      >
        <Path
          path={ring}
          start={0}
          end={0.23}
          color="#CFFF9A"
          style="stroke"
          strokeWidth={5}
          strokeCap="round"
        >
          <BlurMask blur={5} style="solid" />
        </Path>
        <Path
          path={ring}
          start={0}
          end={0.23}
          color="#F0FFCA"
          style="stroke"
          strokeWidth={1.5}
          strokeCap="round"
        />
        <Circle cx={center + radius} cy={center} r={3} color="#E8FFB6">
          <BlurMask blur={3} style="solid" />
        </Circle>
      </Group>

      <Group
        origin={{ x: center, y: center }}
        transform={counter}
        opacity={orbitOpacity}
      >
        <Circle cx={center - radius - 10} cy={center} r={2} color="#B6E5CB" />
        <Circle cx={center + radius + 10} cy={center} r={1.5} color="#C6FF87" />
        <Circle cx={center} cy={center - radius - 10} r={1} color="#D8F798" />
      </Group>

      <Group
        origin={{ x: center, y: center }}
        transform={[{ rotate: -Math.PI / 2 }]}
      >
        <Path
          path={ring}
          start={0}
          end={fill}
          color="#D8F798"
          style="stroke"
          strokeWidth={3}
          strokeCap="round"
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    top: -glowPadding,
    left: -glowPadding,
  },
});
