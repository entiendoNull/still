import AppIntents
internal import ExpoAppIntents

struct StopFocusIntent: AppIntent {
  static let title: LocalizedStringResource = "End Focus Session"
  static let openAppWhenRun = true

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "stopFocus",
      params: [:]
    )

    return .result(dialog: "Opening Still to end your session.")
  }
}
