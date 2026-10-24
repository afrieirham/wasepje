# 0003: Hard delete a user on Clerk user.deleted

## Status

Accepted (2026-10-24). Resolves #35. Replaces point 4 of [0002](./0002-clerk-webhooks-own-user-records.md).

## Context

ADR 0002 left `user.deleted` unhandled because deleting a `User` cascades to its `Link` and `Click` rows, which made deletion a product decision.

## Decision

1. A signed `user.deleted` event hard deletes the matching `User`. Its `Link`, `Phone`, and `Click` rows go with it through the existing cascade.
2. Before the delete, the webhook cancels the user's Stripe subscription immediately when the user has a `stripeId`. Cancellation does not wait for the end of the billing period, and there is no automatic refund.
3. The Stripe step runs first and the delete runs second. If the Stripe step fails, the row stays, so the retry still knows the `stripeId`. A failure in either step returns 500 so Svix retries.
4. Stripe errors for a customer that no longer exists, or a subscription that is already cancelled, count as success. Every other Stripe error returns 500.
5. A `user.deleted` for an unknown user returns 200. A replay does not fail and does not double-apply.
6. A Stripe event for a deleted user, such as `customer.subscription.deleted`, finds no user and returns 200.

## Consequences

- Click history is lost. The product accepts this so that no personal data is kept after the account is gone.
- The email is freed. The same address can register again with a new Clerk id.
- A `user.updated` that arrives after `user.deleted` recreates the user. Clerk does not guarantee delivery order, and keeping a tombstone of deleted ids would keep the data this decision removes. This is a known gap, alongside the out-of-order email gap in #32.
- A deleted user's slug URLs behave like unknown slugs. Nothing shows that the account existed.
