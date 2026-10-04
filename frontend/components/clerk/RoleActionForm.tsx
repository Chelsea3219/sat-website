// RoleActionForm.tsx
'use client'

import { useActionState } from 'react'

type ActionState = { message: string }
type RoleAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>

export function RoleActionForm({
  action,
  userId,
  role,
  buttonLabel,
}: {
  action: RoleAction
  userId: string
  role?: string
  buttonLabel: string
}) {
  const [state, formAction, isPending] = useActionState(action, { message: '' })

  return (
    <form action={formAction}>
      <input type="hidden" value={userId} name="id" />
      {role && <input type="hidden" value={role} name="role" />}
      <button type="submit" disabled={isPending}>
        {isPending ? '...' : buttonLabel}
      </button>
      {state.message && <p className="text-sm text-gray-500">{state.message}</p>}
    </form>
  )
}