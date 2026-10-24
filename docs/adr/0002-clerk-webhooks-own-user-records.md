# 0002: Clerk webhooks own user records

Status: Accepted (2026-10-24)

## Context

Links reference a `User` row by id (`Link.userId` is a foreign key), so a row must exist before a user can create a link. Clerk is the identity provider, but the database only learned about a user when they opened the dashboard: the client called `user.sync`, which upserted the row and wrote `publicMetadata.plan` back to Clerk.

That made the dashboard the only writer. A user who never opened it had no row, and an email change in Clerk never reached the database until the next visit.

Clerk delivers `user.created` and `user.updated` as webhooks signed with svix. The repository already depends on `svix`.

## Decision

1. **Clerk webhooks are the source of user records.** `POST /api/clerk/webhook` verifies the svix signature against the raw body before any parsing or write, then upserts the user keyed on the Clerk id. A replayed event updates the same row.
2. **The dashboard `user.sync` stays as a fallback until the webhook is confirmed live in production.** Once it is, the client calls, the `user.sync` mutation, and its `publicMetadata.plan` write are removed together. Nothing in the repository reads that metadata.
3. **Retry policy follows whether a retry can succeed:**
   - A signature that fails verification returns 400 with a fixed body. Details are logged, not returned.
   - A signed payload that does not match the user schema returns 400 and is logged. It cannot succeed on retry.
   - A database failure returns 500 so Svix retries once the database recovers.
4. **`user.deleted` is not handled yet.** Deleting a `User` cascades to `Link` and `Click`, so the deletion behaviour is a product decision tracked in #35.

## Consequences

- One write path for user records once the fallback is removed, and replays are idempotent.
- Until the webhook is live, new users still depend on the dashboard fallback.
- A schema change on Clerk's side drops affected events with 400 and no retry. The log line is the only alarm, so it needs monitoring.
- Two gaps remain in the implementation, documented in #32: an email that collides with another user's row returns 500 and retries indefinitely, and out-of-order delivery can overwrite a newer email with an older one.
- The `user.deleted` handling will get its own ADR when #35 is decided.
