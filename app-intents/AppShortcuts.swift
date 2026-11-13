import AppIntents

struct AppShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: StartFocusIntent(),
      phrases: [
        "Start a focus session in \(.applicationName)",
        "Time to focus with \(.applicationName)"
      ],
      shortTitle: "Start Focusing",
      systemImageName: "timer"
    )

    AppShortcut(
      intent: StopFocusIntent(),
      phrases: ["End my focus session in \(.applicationName)"],
      shortTitle: "End Session",
      systemImageName: "stop.circle"
    )
  }
}
