# G&G Steakout Mobile App

Installable mobile ordering experience for G&G Steakout.
Deployed with Vercel from GitHub.

## Stripe Connect payment structure

- G&G Steakout II Downtown, LLC is the settlement merchant and receives the full customer payment less FlavorStream's application fee.
- FlavorStream's application fee is exactly 15% of the server-validated pretax food subtotal.
- Sales tax is excluded from FlavorStream's commission and passes to G&G.
- Destination charges use `on_behalf_of` and `transfer_data.destination` for G&G's connected account.
- Stripe processing fees remain with the FlavorStream platform under the all-inclusive Option A arrangement.
- Live payment creation fails closed until `STRIPE_LIVE_ENABLED=true` and a valid connected-account ID are both present.

### Protected Vercel environment variables

- `STRIPE_SECRET_KEY` — use the sandbox key in Preview and the live platform key in Production.
- `STRIPE_WEBHOOK_SECRET` — keep Preview and Production webhook signing secrets separate.
- `STRIPE_CONNECTED_ACCOUNT_ID` — G&G's `acct_...` ID; required in Production and optional for Connect testing in Preview.
- `STRIPE_LIVE_ENABLED` — keep `false` until G&G onboarding, payment capability, payout capability, and the controlled launch test are approved.

Never expose these values to the browser or commit them to Git.

## Phone installation

- The web app manifest names the installed app `G&G Steakout`.
- Android uses the in-app installation prompt when supported.
- iPhone customers receive instructions to use Share > Add to Home Screen.
- The installed app opens in standalone display mode with the G&G bull icon.


## Customer confirmations

The cart saves an Email, Text, or Both preference in Stripe session metadata. The return page verifies paid status server-side and displays the Stripe line items, total, tax, fulfillment details, and a printable payment summary. A browser-bound HttpOnly receipt cookie protects access; older payments cannot use this summary. The payment reference is not a restaurant order number.

Email and SMS delivery are NOT connected. No customer confirmation messages are sent by this app. Toast submission, permanent restaurant order storage, scheduling, restaurant acceptance, and ready-for-pickup notifications remain unimplemented. Do not enable live ordering based on this payment-summary change. A delivery provider and retry/idempotency-backed order fulfillment must be implemented and tested first.
