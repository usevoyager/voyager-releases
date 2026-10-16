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

## Independent content updates

`content/v1` hosts signed, immutable skill and technique revisions, separately from installers.
The `Publish signed Voyager content` workflow accepts reviewed skill exports, imports the
reviewed website technique export, and refreshes seven-day metadata every six hours. New
revisions are nightly-only. Manual promotion names exact `id@revision` values and requires
nightly observation plus minimum/current-runtime evidence. Revocation records persist and
catalog sequences increase; rolling back selects an older retained digest.

The Ed25519 signing key exists only in the `VOYAGER_CONTENT_SIGNING_KEY` Actions secret and
Doppler `studio/prd`; this repository contains its public verification key. Do not grant signing
credentials to pull-request jobs. Main-branch code owns signing; unsigned `content/candidates`
files are not an application trust source. Clients pin the public key shipped with Voyager,
verify metadata before payload download, and retain their last good installed set offline.

Run `node --test scripts/content-publisher.test.mjs` with Node 24.21.0. The versioned envelope is
`{schemaVersion:1,keyId,payload,signature}`, with base64 exact catalog bytes and an Ed25519
signature over `UTF8("voyager-content:v1:" + namespace + ":" + keyId + "\0") || payloadBytes`.

The publisher validates the same Effect schema as the app. `scripts/content-schema.mjs` is the
readable ESM build of `packages/contracts/src/contentCatalog.ts` in video-editor (VOY-438).
After a reviewed schema change, regenerate from that checkout with
`bun build packages/contracts/src/contentCatalog.ts --external effect --external semver --target node --format esm --outfile <voyager-releases>/scripts/content-schema.mjs`,
then run both repositories' focused catalog tests. Keep the Effect/semver versions aligned.

The initial VOY-438 snapshot contains 61 skill packages from app commit
`23ec158e5` and 37 technique revisions from reviewed website PR 213 (export built from
`3dafe638d1edf8f5402d6076d2f5f9f831324405`). The not-yet-deployed website export was
served locally for this bootstrap, with identical record/payload integrity validation.
All initial releases are nightly-only. No stable promotion or installer release is included.
