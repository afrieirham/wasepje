# 0001: Only upgrade to Pro on a paid checkout

## Status

Accepted

## Context

Stripe's `checkout.session.completed` event fires when a checkout finishes, which can be before the money has moved. Payment methods that settle later (for example bank debits) complete the session with `payment_status: "unpaid"`, then send `checkout.session.async_payment_succeeded` once the funds clear.

Every payment method we currently enable is instant, so the session is always `paid` when it completes.

## Decision

The webhook upgrades a user to Pro only when `session.payment_status === "paid"`. Any other status leaves the plan unchanged.

We do not support delayed payment methods. The webhook does not handle `checkout.session.async_payment_succeeded` or `checkout.session.async_payment_failed`.

## Consequences

- Enabling a delayed payment method without further work leaves paying users on the free plan. The webhook would skip their completed session and ignore the later success event.
- Before enabling a delayed method, the webhook must handle `checkout.session.async_payment_succeeded` with the same upgrade logic, handle `checkout.session.async_payment_failed` if we want to act on failures, and the Stripe webhook endpoint must be subscribed to those events. Stripe only delivers events that are subscribed.
- Zero-amount or fully discounted checkouts report `payment_status: "no_payment_required"`. Under this decision they do not upgrade. Those checkouts are not used today.
