import AppIntents
internal import ExpoAppIntents

struct StartFocusIntent: AppIntent {
  static let title: LocalizedStringResource = "Start Focus Session"
  static let description = IntentDescription(
    "Open Still and start a focus session. An active session is kept, not reset."
  )
  static let openAppWhenRun = true

  @Parameter(title: "Minutes", default: 25, inclusiveRange: (1, 180))
  var minutes: Int

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    guard (1...180).contains(minutes) else {
      throw $minutes.needsValueError("Choose between 1 and 180 minutes.")
    }

    await AppIntentDispatcher.shared.dispatch(
      name: "startFocus",
      params: ["minutes": .int(minutes)]
    )

    return .result(dialog: "Opening Still for your focus session.")
  }
}
