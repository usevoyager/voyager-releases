# Fourth stable content promotion (owner override), October 19, 2026

Same order as [the third promotion](../stable-2026-10-19-override/README.md): John wants nothing
left nightly-only for stable users, and approved publishing Kleo's technique at 2:17 PM PT. It went
live on voyager.so at 2:36 PM PT and was signed onto nightly by the refresh run
https://github.com/usevoyager/voyager-releases/actions/runs/39329145001 (sequence 51).
**This promotion skips the 12-hour nightly observation** through the `override` input; stable
dependency validation (PR 6), evidence, revocation and integrity checks still apply.

These are every revision not on stable at sequence 51 ([refs.txt](refs.txt)). Each payload passes
its signed SHA-256 and length check. The technique's only suggested skill, `skills/voiceover`, is
already stable.

| Revision | Entered nightly | Hours on nightly |
| --- | --- | --- |
| `skills/publish-video@3` | 2026-10-19T21:11:24.092Z | 0.5 |
| `skills/room-to-video@3` | 2026-10-19T21:24:06.891Z | 0.3 |
| `techniques/clone-your-voice-for-narration@1` | 2026-10-19T21:39:20.027Z | 0.0 |
