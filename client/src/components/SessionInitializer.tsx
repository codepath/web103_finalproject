import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { refreshSession } from '../store/slices/auth.slice'
import { persistSession } from '../lib/session'

export default function SessionInitializer() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.access_token)

  useEffect(() => {
    console.log('sessionInit')
    dispatch(refreshSession())
    console.log('sessionInit done')
  }, [dispatch])

  // Schedule token refresh when session is loaded or updated
  // Creates a loop that refreshes the token 2 minutes before it expires
  useEffect(() => {
    if (session) {
      // Schedule the token refresh
      console.log('persistSession')
      persistSession(60 * 60 * 1000, dispatch);
      console.log('persistSession done')
    }
  }, [session, dispatch]);

  return null
}