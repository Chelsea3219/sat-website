import { auth, clerkClient } from '@clerk/nextjs/server'

// Checks that the current user has the admin Role before updating the specificied user's Role 
export async function setRole(prevState: unknown, formData: FormData) {
  const { sessionClaims } = await auth()

  if (sessionClaims?.metadata?.role !== 'admin') {
    return { message: 'Not Authorized' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err) {
    return { message: err instanceof Error ? err.message : String(err) }
  }
}

// Removes the role from the specified user
export async function removeRole(prevState: unknown, formData: FormData) {
  const { sessionClaims } = await auth()

  if (sessionClaims?.metadata?.role !== 'admin') {
    return { message: 'Not Authorized' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err) {
    return { message: err instanceof Error ? err.message : String(err) }
  }
}