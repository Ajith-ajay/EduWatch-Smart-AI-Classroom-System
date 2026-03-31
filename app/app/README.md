# EduWatch Flutter App

This module is the Flutter client application for EduWatch. It can target Android, iOS, web, and desktop platforms and is intended to consume the EduWatch backend APIs.

## Prerequisites

- Flutter SDK (compatible with Dart SDK `^3.5.3`)
- Android Studio/Xcode/desktop toolchains depending on target
- Backend API running (`app/api`)

## Folder Structure

```text
app/
├── lib/                  # Flutter source code
├── android/
├── ios/
├── web/
├── windows/
├── linux/
├── macos/
├── test/
└── pubspec.yaml
```

## Setup Commands

From repository root:

```bash
cd app/app
flutter pub get
```

Check environment:

```bash
flutter doctor
```

## Run Commands

Run on connected/default device:

```bash
flutter run
```

Run on a specific target:

```bash
flutter run -d android
flutter run -d chrome
flutter run -d windows
```

## Build Commands

```bash
flutter build apk
flutter build appbundle
flutter build web
flutter build windows
```

## Test and Lint Commands

```bash
flutter test
flutter analyze
```

## Integration Notes

- Ensure backend API URL used by the app points to your running `app/api` instance.
- If you run API and app on different networks/devices, update the base URL to a reachable host IP.

## Common Issues

- If dependencies fail: run `flutter clean` then `flutter pub get`.
- If emulator is not detected: verify platform-specific SDK setup with `flutter doctor`.
