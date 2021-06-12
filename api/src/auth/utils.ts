import { JwtPayload } from './JwtPayload';
import { Jwt } from './Jwt'
import { Jwks } from './Jwks';
import Axios from 'axios'
import { verify, decode } from 'jsonwebtoken'

const jwksUrl = process.env.JWKS_URL;

export async function verifyToken(authHeader: string, signingKeys?: Array<Jwks>): Promise<JwtPayload> {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
      
    if (jwt.header.alg !== 'RS256') {
      throw new Error('Token is not of type RS256 and not supported');
    }
  
    // Get keys from service
    const tokenKeyId = jwt.header.kid;
    const keys = await getJwks();
    // Filter keys, read from cache to see if already available
    if (!signingKeys || !signingKeys.length) {
      signingKeys = getSigningKeys(keys);
    }
    // Get signing keys
    const signingKey = getSigningKey(tokenKeyId, signingKeys);
    try {
      const decoded = verify(
        token,
        signingKey.publicKey,
        {
          algorithms: [
            'RS256'
          ]
        }   
      ) as JwtPayload;
      return decoded;
    } catch (e) {
      throw new Error('Invalid signing key, unable to decode JWT');
    }
  }
  
  function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return token
  }
  
  async function getJwks(): Promise<Array<Jwks>> {
    let keys: Array<Jwks>;
    try {
      const result = await Axios.get(
        jwksUrl
      );
      keys = result.data.keys;
    } catch (e) {
      throw new Error(`Failed to fetch JWKS: ${e}`);
    }
    return keys;
  }
  
  function getSigningKeys(keys: Array<Jwks>): Array<Jwks> {
    if (!keys || !keys.length) {
      throw new Error('The JWKS endpoint did not contain any keys');
    }
  
    const signingKeys = keys.filter(key =>
      key.use === 'sig' // JWK property `use` determines the JWK is for signature verification
        && key.kty === 'RSA' // We are only supporting RSA (RS256)
        && key.kid // The kid must be present to be useful for later
        && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    ).map(key => {
      return { publicKey: certToPEM(key.x5c[0]), ...key };
    });
  
    if (!signingKeys.length) {
      throw new Error('The JWKS endpoint did not contain any signature verification keys');
    }
  
    return signingKeys;
  }
  
  function getSigningKey(kid: string, keys: Array<Jwks>): Jwks {
    const signingKey = keys.find(key => 
      key.kid === kid
    )
  
    if (!signingKey) {
      throw new Error(`Unable to find a signing key that matches ${kid}`)
    }
  
    return signingKey;
  }
  
  export function certToPEM(cert: string) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
  }
