/**
 * A payload of a JWKS object
 */
export interface Jwks {
  alg: string
  kty: string
  use: string
  x5c: Array<string>
  n: string
  e: string
  kid: string
  x5t: string
  publicKey?: string
}
