import { redirect } from 'next/navigation'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { SearchUsers } from '../../components/clerk/SearchUsers'
import { removeRole, setRole } from './_actions'
import { RoleActionForm } from '@/components/clerk/RoleActionForm'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>
}) {
  const { sessionClaims } = await auth()

  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/')
  }

  const query = (await params.searchParams).search
  const client = await clerkClient()
  const users = query ? (await client.users.getUserList({ query })).data : []

  return (
    <>
      <p>This is the protected admin dashboard restricted to users with the `admin` Role.</p>
      <SearchUsers />

      {users.map((user) => (
        <div key={user.id}>
          <div>{user.firstName} {user.lastName}</div>
          <div>
            {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
          </div>
          <div>{user.publicMetadata.role as string}</div>

          <RoleActionForm action={setRole} userId={user.id} role="admin" buttonLabel="Make Admin" />
          <RoleActionForm action={setRole} userId={user.id} role="moderator" buttonLabel="Make Moderator" />
          <RoleActionForm action={removeRole} userId={user.id} buttonLabel="Remove Role" />
        </div>
      ))}
    </>
  )
}