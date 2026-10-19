# Third stable content promotion (owner override), October 19, 2026

John ordered at 2:10 PM PT that everything still nightly-only be promoted to stable at once
("we need to fix this asap and release a fix"): stable 2026.10.19+2 shows today's two new techniques
as not on the user's update channel yet. **This promotion skips the 12-hour nightly observation
under that order**, using the workflow's `override` input, which is recorded in the audit file.
It does not skip evidence, revocation or integrity checks.

Measured at 2026-10-19T21:10Z against catalog sequence 47. All 13 references ([refs.txt](refs.txt))
are every revision not yet on stable; each payload passes its signed SHA-256 and length check.
Their observation on nightly ranged from 0.6 to 3.5 hours, so this is not the normal evidence
standard; the skills come from reviewed main commits of the application repository, and the
techniques from the reviewed website export.

| Revision | Entered nightly | Hours on nightly |
| --- | --- | --- |
| `skills/blender-previs-to-photoreal-style-transfer@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/cad-to-cinematic-product-animation-blender@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/cinematic-car-film-blender-original-score@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/composite-3d-object-into-live-action-blender@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/fpv-drone-flythrough-blender@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/talking-character-launch-video@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `skills/choose-media-model@6` | 2026-10-19T20:10:06.992Z | 1.0 |
| `skills/make-ai-video@9` | 2026-10-19T20:10:06.992Z | 1.0 |
| `skills/edit-in-blender@5` | 2026-10-19T20:34:07.109Z | 0.6 |
| `skills/gpu-machines@7` | 2026-10-19T20:34:07.109Z | 0.6 |
| `skills/room-to-video@2` | 2026-10-19T20:34:07.109Z | 0.6 |
| `techniques/add-cg-behind-actor-blender-fusion@1` | 2026-10-19T17:36:21.431Z | 3.5 |
| `techniques/script-scene-to-blender-previs@1` | 2026-10-19T17:36:21.431Z | 3.5 |
