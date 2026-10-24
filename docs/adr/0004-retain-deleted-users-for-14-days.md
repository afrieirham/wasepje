# 0004: Keep a deleted user's data for 14 days before purge

## Status

Accepted (2026-10-24). Supersedes [0003](./0003-hard-delete-on-clerk-user-deleted.md).

## Context

ADR 0003 hard deletes the `User` row when Clerk sends `user.deleted`. Users who delete their account by mistake cannot get their links and clicks back.

Clerk deletes the account before it sends the event, so a deleted user cannot log in with the same login. A new sign-up gets a new Clerk id.

## Decision

1. A signed `user.deleted` event sets `deletedAt` on the `User` row. The row, its `Link`, `Phone`, and `Click` rows are kept.
2. While `deletedAt` is set:
   - the user's slug URLs behave like unknown slugs;
   - `user.updated` events for that user are ignored.
3. The Stripe subscription is not cancelled when deletion starts. The webhook sets `cancel_at_period_end` on it. Stripe does not renew it, and no refund is made.
4. A signed `user.created` whose primary email matches a deleted row, within 14 days of `deletedAt`, restores the account. The row moves to the new Clerk id, and `deletedAt` is cleared.
   - If the subscription is still active, the user stays on Pro. If `cancel_at_period_end` is set, it is cleared.
   - If the subscription has already ended, the plan is `free` and the user subscribes again.
5. A daily cron job purges rows whose `deletedAt` is more than 14 days old. For each one, it cancels any live subscription immediately and deletes the row. Cascade removes the rows it owns. A repeated run finds nothing new to do.
6. The email stays reserved on the deleted row for the whole 14 days.

## Consequences

- Personal data, including the email and click history, is kept for up to 14 days after deletion.
- A user who does not sign up again within 14 days loses their data at the purge.
- Restoring an account gives it a new Clerk id. The data is kept, but the login is new.
- Subscriptions are not charged after the current period ends for a deleted account.
- Out-of-order `user.updated` events no longer change a deleted row, which narrows the gap accepted in ADR 0003.
- Changing a `User` primary key is done in the restore path. The foreign keys on `Link` must follow the change. This must be checked in the migration before it is used.
