# Second stable content promotion, October 19, 2026

Follow-up to [the first promotion](../stable-2026-10-19/README.md), under the same owner approval
(Pyre ask "Promote all current skills + techniques to stable", 9:47 AM PT). It promotes the 59 skill
revisions held back from the first run: the 13 that had been on nightly for less than 12 hours, plus
the 46 older revisions of the same skills. The exact references are in [refs.txt](refs.txt).
Measured at 2026-10-19T20:28Z against catalog sequence 45 (published 2026-10-19T20:10:06Z).

## Nightly observation

Every promoted revision entered nightly between 2026-10-16T21:59Z and 2026-10-19T08:21Z; the shortest
observation is 12.1 hours. Nothing is revoked. Every payload passes its signed SHA-256 and length check.
The publisher's update step, dry-run with these references, validates (skills sequence 45 to 46).

## Not promoted (under 12 hours on nightly)

| Revision | Entered nightly | Hours |
| --- | --- | --- |
| `skills/blender-previs-to-photoreal-style-transfer@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/cad-to-cinematic-product-animation-blender@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/cinematic-car-film-blender-original-score@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/composite-3d-object-into-live-action-blender@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/fpv-drone-flythrough-blender@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/talking-character-launch-video@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `skills/choose-media-model@6` | 2026-10-19T20:10:06.992Z | 0.3 |
| `skills/make-ai-video@9` | 2026-10-19T20:10:06.992Z | 0.3 |
| `techniques/add-cg-behind-actor-blender-fusion@1` | 2026-10-19T17:36:21.431Z | 2.9 |
| `techniques/script-scene-to-blender-previs@1` | 2026-10-19T17:36:21.431Z | 2.9 |

The two techniques qualify at 2026-10-20T05:36:21Z. The six new skills qualify at the same time,
and `choose-media-model@6` and `make-ai-video@9` at 2026-10-20T08:10:07Z.

## Bundled copies

An official catalog skill replaces the bundled copy in 2026.10.19. From 2026.10.19+2 (app PR 2891)
the bundled copy is kept when the catalog only has an older revision. Each skill's highest stable
revision after this promotion was compared byte for byte with the bundled skills:

- 2026.10.19 (source `c388c2bf74`): no skill selects an older revision than the one it bundles.
  `edit-video` (bundled @3) and `publish-video` (bundled @1) move up to @4 and @2; the others match.
- 2026.10.19+2 (source `98aeea354a`, release run
  https://github.com/moda-design/video-editor/actions/runs/39299570782): every bundled skill that
  is in the catalog matches its highest stable revision. It also bundles the six new nightly-only
  skills listed above, which have no stable revision yet. It does not bundle
  `choose-media-model@6` or `make-ai-video@9`.

## Minimum and current runtimes

All promoted revisions declare minimum `2026.10.16`, with no maximum and no required capabilities.
Selection with the application's `selectContentRevisions` and these references marked stable:

| Runtime | Skills | Techniques |
| --- | --- | --- |
| stable 2026.10.19 | 63 | 43 |
| stable 2026.10.19+2 (current stable) | 63 | 43 |
| stable 2026.10.18 | 63 | 43 |

Stable selects the highest stable revision of each skill, so the older revisions promoted here are
never chosen over the newest one.

## Promoted revisions

| Revision | Entered nightly | Hours |
| --- | --- | --- |
| `skills/blender-looks@1` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/blender-sets@1` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/choose-media-model@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/choose-media-model@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/choose-media-model@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/choose-media-model@4` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/choose-media-model@5` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/edit-in-blender@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/edit-in-blender@2` | 2026-10-17T18:12:54.516Z | 50.2 |
| `skills/edit-in-blender@3` | 2026-10-17T19:24:07.235Z | 49.1 |
| `skills/edit-in-blender@4` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/edit-video@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/edit-video@2` | 2026-10-17T07:36:18.772Z | 60.9 |
| `skills/edit-video@3` | 2026-10-17T22:54:28.692Z | 45.6 |
| `skills/edit-video@4` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/gpu-machines@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/gpu-machines@2` | 2026-10-17T00:00:22.291Z | 68.5 |
| `skills/gpu-machines@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/gpu-machines@4` | 2026-10-17T02:14:02.939Z | 66.2 |
| `skills/gpu-machines@5` | 2026-10-18T05:08:21.736Z | 39.3 |
| `skills/gpu-machines@6` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/make-ai-video@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/make-ai-video@2` | 2026-10-16T22:35:39.473Z | 69.9 |
| `skills/make-ai-video@3` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/make-ai-video@4` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/make-ai-video@5` | 2026-10-17T07:14:51.332Z | 61.2 |
| `skills/make-ai-video@6` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/make-ai-video@7` | 2026-10-17T16:08:56.179Z | 52.3 |
| `skills/make-ai-video@8` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/make-announcement-video@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/make-announcement-video@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/make-announcement-video@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/make-announcement-video@4` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/make-announcement-video@5` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/make-image@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/make-image@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/make-image@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/make-image@4` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/make-image@5` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/make-music@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/make-music@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/make-music@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/make-music@4` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/make-music@5` | 2026-10-17T15:41:33.527Z | 52.8 |
| `skills/make-music@6` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/make-sound@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/make-sound@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/make-sound@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/make-sound@4` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/make-sound@5` | 2026-10-19T06:46:42.171Z | 13.7 |
| `skills/publish-video@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/publish-video@2` | 2026-10-19T08:21:16.981Z | 12.1 |
| `skills/voiceover@1` | 2026-10-16T21:59:26.233Z | 70.5 |
| `skills/voiceover@2` | 2026-10-16T22:53:46.973Z | 69.6 |
| `skills/voiceover@3` | 2026-10-17T00:26:22.217Z | 68.0 |
| `skills/voiceover@4` | 2026-10-17T07:22:20.572Z | 61.1 |
| `skills/voiceover@5` | 2026-10-17T09:22:28.216Z | 59.1 |
| `skills/voiceover@6` | 2026-10-17T22:54:28.692Z | 45.6 |
| `skills/voiceover@7` | 2026-10-19T06:46:42.171Z | 13.7 |
