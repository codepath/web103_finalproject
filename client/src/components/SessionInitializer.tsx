import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { refreshSession } from '../store/slices/auth.slice'
import { persistSession } from '../lib/session'

export default function SessionInitializer() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.access_token)

  // refresh the session on app load to check if the user is still authenticated
  useEffect(() => {
    dispatch(refreshSession())
  }, [dispatch])

  // schedule token refresh when session is loaded or updated
  // creates a loop that refreshes the token 2 minutes before it expires
  useEffect(() => {
    if (session) {
      // schedule the token refresh, passing in the token expiration time (1 hour) and the dispatch function to refresh the token
      persistSession(60 * 60 * 1000, dispatch);
    }
  }, [session, dispatch]);

  return null
}