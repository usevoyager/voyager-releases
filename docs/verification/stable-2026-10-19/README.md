# First stable content promotion, October 19, 2026

Owner-approved promotion (Pyre ask "Promote all current skills + techniques to stable", 9:47 AM PT)
of the signed skill and technique revisions that have been on nightly for at least 12 hours,
following `docs/operations/content-updates.md` in the application repository. The exact
references are in [refs.txt](refs.txt): 142 revisions, 62 skill revisions (50 skills) and 80
technique revisions (43 techniques). Measured at 2026-10-19T16:53Z against catalog sequence 40
(skills and techniques, published 2026-10-19T12:40:34Z).

## Nightly observation

Every promoted revision entered nightly between 2026-10-16T21:59Z and 2026-10-17T23:02Z; the
shortest observation is 41.8 hours. No revision in either catalog is revoked. Per-revision times
are in the table at the end.

## Held back

Thirteen skill revisions entered nightly less than 12 hours ago and are not eligible:

| Revision | Entered nightly | Hours |
| --- | --- | --- |
| `skills/blender-looks@1` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/blender-sets@1` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/choose-media-model@5` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/edit-in-blender@4` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/edit-video@4` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/gpu-machines@6` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/make-ai-video@8` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/make-announcement-video@5` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/make-image@5` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/make-music@6` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/make-sound@5` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/voiceover@7` | 2026-10-19T06:46:42.171Z | 10.0 |
| `skills/publish-video@2` | 2026-10-19T08:21:16.981Z | 8.5 |

The older, eligible revisions of the eleven of those skills that have them (`skills/choose-media-model`, `skills/edit-in-blender`, `skills/edit-video`, `skills/gpu-machines`, `skills/make-ai-video`, `skills/make-announcement-video`, `skills/make-image`, `skills/make-music`, `skills/make-sound`, `skills/publish-video`, `skills/voiceover`;
46 revisions) are also held back. An official catalog skill replaces the bundled copy, and the
2026.10.19 and 2026.10.19+1 installers already bundle exactly the newest (held) revisions'
bytes. Promoting an older revision would downgrade those skills for current stable users. They
follow in a later run once their newest revision has 12 hours on nightly (06:46Z and 08:21Z
entries qualify at 18:46Z and 20:21Z). No technique was held back. Techniques published to the
website after the sequence 40 snapshot (for example the two posts publishing today) are not in
the catalog and are not referenced.

## Minimum and current runtimes

Declared minimums: skills `2026.10.16`; techniques `2026.10.17-0` or `2026.10.19`. No entry has
a maximum version or required capabilities. The runtime advertises `content-catalog-v1`.

Selection was run with the application's own `selectContentRevisions` (video-editor main
`5458f01cf1`) over the production catalogs authenticated with the application's pinned public
key (`voyager-content-2026-10`), with these references marked stable in memory:

| Runtime | Skills | Techniques |
| --- | --- | --- |
| stable 2026.10.19 (current stable) | 50 | 43 |
| stable 2026.10.19+1 (hotfix draft) | 50 | 43 |
| stable 2026.10.18 | 50 | 43 |
| nightly 2026.10.20-nightly.20261019.1 | 63 | 43 (unchanged) |

Before promotion every stable runtime selected 0 and fell back to bundled content. The newest
published nightly installer (`2026.10.16-nightly.20261015.9639`) sorts below the declared
minimum and selects nothing either way.

## Workflow exercise

- Skills: for all 50 skills, the promoted (newest stable) revision is byte-identical to the
  copy bundled in stable 2026.10.19 (source `c388c2bf74`, release run
  https://github.com/moda-design/video-editor/actions/runs/39195034998, success) and in the
  2026.10.19+1 draft (source `9b47327607`). Current stable users run the skill text their
  release gate exercised; 2026.10.18 and older stable users move up to it.
- Techniques: the strip, chip and offline path were exercised end to end in a real Electron
  build for VOY-438 ([verification](../voy-438/README.md)). This promotion did not repeat a
  per-technique app exercise; all 80 promoted technique payloads pass SHA-256 and length checks
  against the signed catalog.
- No open "Nightly full CI failed" issue in the application repository (the last one, #2158,
  closed 2026-10-17). Latest scheduled desktop run 39234742071 on `682a24e376` succeeded.

## Promoted revisions

| Revision | Entered nightly | Hours |
| --- | --- | --- |
| `skills/brand-kit@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/conversation-collaboration@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/critique-track@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/custom-connectors@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/develop-roblox@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/develop-unity@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/develop-unreal@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-ableton@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-after-effects@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-capcut@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-cinema-4d@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-descript@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-effectcraft@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-fframes@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-final-cut@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-houdini@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-hyperframes@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-illustrator@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-lightcraft@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-manim@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-photocraft@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-photoshop@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-premiere@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-reaper@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-remotion@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-resolve@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-tesseract@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/edit-in-vectorcraft@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/figma@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/find-samples@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-deck@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-design@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-game@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-motion-graphics@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-product-demo@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-social-loop@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-web-game@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/make-x-game@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/mini-flows@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/publish-game@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/publish-to-itch@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/record-in-obs@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/room-to-video@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/screen-capture@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/use-comfyui@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/use-computer@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/use-pixellab@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/video-styles@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/voyager-setup@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/widgets@1` | 2026-10-16T21:59:26.233Z | 66.8 |
| `skills/use-computer@2` | 2026-10-16T22:53:46.973Z | 65.9 |
| `skills/widgets@2` | 2026-10-16T23:30:34.225Z | 65.3 |
| `skills/figma@2` | 2026-10-17T15:23:35.805Z | 49.4 |
| `skills/figma@3` | 2026-10-17T16:04:14.610Z | 48.7 |
| `skills/figma@4` | 2026-10-17T16:09:59.856Z | 48.6 |
| `skills/edit-in-final-cut@2` | 2026-10-17T19:10:50.934Z | 45.6 |
| `skills/edit-in-remotion@2` | 2026-10-17T19:39:22.664Z | 45.2 |
| `skills/make-product-demo@2` | 2026-10-17T22:54:28.692Z | 41.9 |
| `skills/screen-capture@2` | 2026-10-17T22:54:28.692Z | 41.9 |
| `skills/widgets@3` | 2026-10-17T22:54:28.692Z | 41.9 |
| `skills/make-deck@2` | 2026-10-17T23:02:22.373Z | 41.8 |
| `skills/make-design@2` | 2026-10-17T23:02:22.373Z | 41.8 |
| `techniques/3d-model-to-product-commercial@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/ai-video-character-replacement@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/ai-video-keyframe-timing@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/animate-a-poster@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/animated-chart-from-csv@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/animated-screen-recording-callouts@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/archival-footage-montage@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/blender-camera-guide@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/character-sketch-to-ai-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/cinematic-title-sequence@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/clay-character-animation@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/color-grade-log-footage@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-auto-captions-codex-fal@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-green-screen@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-remove-background@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-remove-background-noise@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-slow-motion@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-stabilize-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/davinci-resolve-free-vertical-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/direct-ai-voiceover@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/drawing-to-playable-game@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/engineering-drawing-to-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/exploded-food-animation@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/find-existing-footage@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/game-ready-sprite@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/layered-poster-motion@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/liquid-product-reveal@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/miniature-world-reveal@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/product-photo-loop@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/real-ui-product-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/repair-video-insert@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/resize-social-media-graphics@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/score-video@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/silent-clip-foley@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/three-ad-styles@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/two-character-ai-dialogue@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/video-to-blender-animation@1` | 2026-10-16T22:02:33.720Z | 66.8 |
| `techniques/3d-model-to-product-commercial@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/ai-video-character-replacement@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/ai-video-keyframe-timing@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/animate-a-poster@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/animated-chart-from-csv@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/animated-screen-recording-callouts@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/archival-footage-montage@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/blender-camera-guide@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/character-sketch-to-ai-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/cinematic-title-sequence@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/clay-character-animation@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/color-grade-log-footage@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-auto-captions-codex-fal@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-green-screen@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-remove-background@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-remove-background-noise@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-slow-motion@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-stabilize-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/davinci-resolve-free-vertical-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/direct-ai-voiceover@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/drawing-to-playable-game@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/engineering-drawing-to-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/exploded-food-animation@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/find-existing-footage@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/game-ready-sprite@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/layered-poster-motion@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/liquid-product-reveal@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/miniature-world-reveal@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/product-photo-loop@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/real-ui-product-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/repair-video-insert@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/resize-social-media-graphics@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/score-video@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/silent-clip-foley@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/three-ad-styles@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/two-character-ai-dialogue@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/video-to-blender-animation@2` | 2026-10-17T00:55:20.336Z | 63.9 |
| `techniques/blender-previs-to-photoreal@1` | 2026-10-17T07:14:51.332Z | 57.6 |
| `techniques/cad-model-to-product-animation@1` | 2026-10-17T07:14:51.332Z | 57.6 |
| `techniques/cinematic-car-film-blender@1` | 2026-10-17T07:14:51.332Z | 57.6 |
| `techniques/composite-3d-object-into-footage@1` | 2026-10-17T07:14:51.332Z | 57.6 |
| `techniques/fpv-drone-flythrough-blender@1` | 2026-10-17T07:14:51.332Z | 57.6 |
| `techniques/talking-character-launch-video@1` | 2026-10-17T07:14:51.332Z | 57.6 |
