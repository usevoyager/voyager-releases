# VOY-438 application verification

[Nine-second real Electron demo](demo.mp4) · [catalog](catalog.png) · [chip](chip.png) · [offline relaunch](offline.png)

Recorded October 16, 2026 from app PR 2746 in an isolated Linux container with its own
PID namespace/reaping init, disposable HOME/profile/keyring, and bounded memory/processes.
The application used the approved test account, with no generation or provider turn sent.

This is a test build: its content-selection runtime was stamped `2026.10.20`, channel
`nightly`, in the disposable compiled artifact so the initial website records (minimum
`2026.10.19`) are eligible. Source package versions are unchanged. Trust verification
was not overridden: the app's actual pinned public key authenticated the production-signed
catalogs in this PR. The seed helper ran the real cache implementation over the exact
payload files and fetched the required posters from their signed CDN URLs.

The mounted row contained 37 techniques; all image paths used `/api/content/media/`
capabilities and the visible posters decoded successfully. Selecting a card inserted its
technique chip. A second launch with outbound Node HTTP(S) routed to an unreachable proxy
retained the signed catalog and rendered the cached row. Optional preview/full videos
were intentionally omitted from this bounded seed; the video records the actual interaction.

Focused mounted-component regressions separately verify late preview/full-video hydration,
frozen identity/order, and transitive required-skill revocation. Signed runtime regressions
cover signature/hash/expiry/rollback, exact offline activation and conversation source pins.
