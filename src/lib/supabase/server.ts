import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          try {
            const storeWithDelete = cookieStore as unknown as { delete?: (name: string) => void }
            if (typeof storeWithDelete.delete === 'function') {
              storeWithDelete.delete(name)
            } else {
              cookieStore.set({ name, value: '', ...options })
            }
          } catch {
            cookieStore.set({ name, value: '', ...options })
          }
        },
      }
    }
  )
}
