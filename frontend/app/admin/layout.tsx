
import { requireAdmin } from '@/lib/auth'


export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  await requireAdmin()

  return (
    <>
      <div className='min-w-0'>
        <div className='max-w-6xl mx-auto pb-10'>{children}</div>
      </div>
    </>
  )
}