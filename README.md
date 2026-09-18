# Voyager downloads

Official signed and Apple-notarized Voyager releases for Apple Silicon Macs.

**[Download Voyager](https://github.com/usevoyager/voyager-releases/releases/latest)**

## Install

Download the `.dmg` asset, open it, and drag Voyager into Applications. Launch
Voyager from Applications, then eject the disk image.

If you already use Voyager, quit it before replacing the app. Keep your profile
and project folders. Older installations need this one-time manual installation
to enable the public update feed.

## Update

Voyager checks for newer releases automatically. Choose **Download update**, then
**Restart to install** when you are ready. Finish active work before restarting.
Downloads and installation are under your control; no GitHub account is needed.

## Release files

- `.dmg`: signed, notarized installer and manual recovery download.
- `Voyager-*.zip`: signed application payload used by the Mac updater.
- `latest-mac.yml` and optional `.blockmap`: update metadata.
- `SHA256SUMS.txt`: checksums for the release files.
- `BUILD-INFO.txt`: version and source/build provenance.
- `voyager-plugin-*.zip`: shared Codex/Claude plugin and installation guidance.
- `voyager-creative-*.tar.gz`: standalone creative CLI runtime and installer.

This repository hosts downloads and release notes. Application development and
builds are maintained separately. Release assets are never replaced in place;
fixes ship under a higher version.
