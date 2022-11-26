Apply for a Veteran's ID card
=============================

This is the Alpha phase prototype of the Office for Veterans' Affairs (OVA)
"Apply for a Veteran's ID card" service.  It's built using the
[GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs)

Getting started
---------------

1. Clone this repository & cd to the directory
2. Run `npm install`
3. Set environment variables in `.env`
4. Run `npm start`
5. Browse to http://localhost:3000

The environment variables you need are:

- `RSA_PRIVATE_KEY`: The private key of the [pair you generated](https://docs.sign-in.service.gov.uk/integrate-with-integration-environment/generate-a-key/) to register the prototype with GOV.UK Sign In.
- `CERT`: The PEM-encoded X509 certificate signed by your `RSA_PRIVATE_KEY`. This is
  used for [multual TLS (mTLS)](https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions)
- `SPOT_PUBLIC_KEY`: The public key of the GOV.UK Credential Issuer. This is used to
  validate the signature on the encrypted JSON Web Token containing the claims supplied
  by Identity Proofing and Verification.
- `ISSUER_BASE_URL`: The base URL of the OpenID Connect Provider (likely https://oidc.integration.account.gov.uk/)
- `CLIENT_ID`: The client ID supplied by GOV.UK Sign In for this prototype
- `CALLBACK_URL`: Where you want the OP to send your users after login,
  which you've registered with GOV.UK Sign In
- `NOTIFYAPIKEY`: An API key for [GOV.UK Notify](https://www.notifications.service.gov.uk/)
- `TEST_EMAIL_CARD_AND_DIGITAL_TEMPLATE`: A template ID from GOV.UK Notify
- `TEST_EMAIL_CARD_ONLY_TEMPLATE`: A template ID from GOV.UK Notify
- `TEST_EMAIL_DIGITAL_ONLY_TEMPLATE`: A template ID from GOV.UK Notify
- `TEST_EMAIL_UNHAPPY_PATH_TEMPLATE`: A template ID from GOV.UK Notify

`RSA_PRIVATE_KEY` MUST have a trailing newline after `-----END RSA PRIVATE KEY-----`
or `rsaUnpack` will choke. (I think this is a bug.)

The template IDs should correspond to email templates we've set up in our Notify acccount.
If you're just developing locally, you don't need the template IDs.  But the service will
fail to start -- even locally -- if `NOTIFYAPIKEY` is undefined. (This is a bug).

You can [read more about using GOV.UK Notify to prototype emails and text messages](docs/documentation/using-notify.md)

Changes merged into the `main` branch will automatically be deployed to GOV.UK PaaS.  You
can access the prototype at https://ova-alpha.london.cloudapps.digital/
