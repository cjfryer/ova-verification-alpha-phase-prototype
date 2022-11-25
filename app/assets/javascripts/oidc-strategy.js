const { Strategy, generators } = require('openid-client')
const { getFakeDIClaimResponse } = require('./fakeDIClaimJWT')

function validateClaims (req, tokenset, userinfo, done) {

  const credential_issuer = (typeof process.env.CREDENTIAL_ISSUER_URL === 'undefined') ?
  "https://identity.integration.account.gov.uk/" : process.env.CREDENTIAL_ISSUER_URL

  const core_id_jwt = userinfo["https://vocab.account.gov.uk/v1/coreIdentityJWT"]

  if (!core_id_jwt) {
    let errorstring = 'coreIdentityJWT not present.'
    console.log(errorstring)
    return done(`${errorstring}. This means we could not prove your identity.`)
  }

  const verification_options = {
    algorithms: ["ES256"],
    issuer: credential_issuer,
    subject: userinfo.sub,
  }
  const pubkey = process.env.SPOT_PUBLIC_KEY

  jwt.verify(core_id_jwt, pubkey, verification_options, (err, decoded) => {
    if (err) {
      return done(`Could not validate coreIdentityJWT: ${err}`)
    }
    userinfo.core_identity = decoded // so the "profile" page can parse it
    return done(null, userinfo)
  })
}

const govUK_IPV_Strategy = function (client) {
  return new Strategy(
    {
      client,
      params: {
        scope: 'openid email phone',
        nonce: generators.nonce(),
        vtr: JSON.stringify(["P2.Cl.Cm"]),
        claims: JSON.stringify({
          userinfo: {
            "https://vocab.account.gov.uk/v1/coreIdentityJWT": {
                essential: true
            }
          }
        })
      },
      passReqToCallback: true
    }, validateClaims
  )
}

const govUK_SignIn_Strategy = function (client) {
  return new Strategy(
    {
      client,
      params: {
        scope: 'openid email phone',
        nonce: generators.nonce()
      },
      passReqToCallback: true
    }, (req, tokenset, userinfo, done) => {
      if (!userinfo) { // Bork
        return('No claims returned from the Identity Provider')
      }
      userinfo.core_identity = getFakeDIClaimResponse('1975')
      return done(null, userinfo)
    }
  )
}

module.exports = {
  validateClaims,
  govUK_IPV_Strategy,
  govUK_SignIn_Strategy
}