# 0005: A free user's custom slug is not a match

Status: Accepted (2026-10-25)

## Context

A link has two slugs. The system slug (`shoes-abc12`) is given to every link. The custom slug (`shoes`) is a Pro feature that the owner picks.

Before the gatekeeper went live on 2026-03-26, the redirect page resolved a custom slug for any owner, including free users. The gatekeeper changed that. Its code kept a separate pre-activation branch, which ran the same lookup and returned the link for a custom slug regardless of plan. That date has passed, so the branch was unreachable and was removed.

## Decision

On the redirect page, a request matches a link only through its system slug, or through its custom slug when the owner is on the `pro` plan.

- System slug match: the link redirects, whatever the owner's plan.
- Custom slug match, owner on `pro`: the link redirects.
- Custom slug match, owner on `free`: treated as an unknown slug. The page shows the 404 screen, as for any unknown slug.

A deleted owner's links behave like unknown slugs for both slugs.

## Consequences

- A free user keeps a custom slug in the database, but it has no effect on redirects. If the user upgrades to Pro, it works again without being set again.
- Downgrading a user to `free` disables their custom slugs without changing any stored data.
- The stored custom slug is still reserved, so no other link can claim it while the owner is on `free`.
