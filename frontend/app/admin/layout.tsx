import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth()

  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <div className='max-w-7xl mx-auto'>{children}</div>
}