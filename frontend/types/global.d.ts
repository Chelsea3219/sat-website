export {}

// Create a type for the Roles
export type Roles = 'admin' | 'moderator' | 'guest'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}