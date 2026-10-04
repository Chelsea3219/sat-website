'use client'

import { usePathname, useRouter } from 'next/navigation'

// Includes a form for searching for users. When submittdd, it appends the search term to the URL as a search parameter. 
// Your /admin route will then perform a query based on the updated URL 
export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const queryTerm = formData.get('search') as string
          router.push(pathname + '?search=' + queryTerm)
        }}
      >
        <label htmlFor="search">Search for users</label>
        <input id="search" name="search" type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}