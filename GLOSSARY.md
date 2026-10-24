# Wasepje

A link service that gives each visitor one of a user's phone numbers. Users pay for the Pro plan, and their account is managed by Clerk.

## Language

**User**:
A person with an account. A User is identified by their Clerk account.
_Avoid_: Account, member

**Link**:
A public URL owned by one User. Visitors who open it are sent to one of the Link's Phones.
_Avoid_: Page, short link

**Phone**:
A phone number attached to a Link.
_Avoid_: Contact, number

**Click**:
One recorded visit to a Link.
_Avoid_: Hit, view

**Pro**:
The paid plan. A User is either Pro or Free.
_Avoid_: Premium, paid user

**Subscription**:
The recurring payment that keeps a User on Pro. It is held with Stripe.
_Avoid_: Plan, billing

**Deleted user**:
A User removed because Clerk reported the account deleted. Its Links, Phones, and Clicks are removed with it.
_Avoid_: Deactivated user, soft-deleted user
