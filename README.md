# Still

A small test project to dogfood [`expo-app-intents`](https://docs.expo.dev/versions/v58.0.0/sdk/app-intents/) in Expo SDK 58.

Ask Siri to start or end a focus session. Swift declares the intents; Expo dispatches them to a React Native timer, animated with Skia and Reanimated.

Uses native development builds, not Expo Go. This is an experiment, not a production app: timer state resets when the app quits or reloads.
