import { refreshSession } from '../store/slices/auth.slice'
import { AppDispatch } from '../store/store'

// refreshes the session 2 minutes before the access token expires
export const persistSession = (expiresIn: number, dispatch: AppDispatch) => {
  const refreshTime = expiresIn - (2 * (60 * 1000))
  console.log('persistSession function refreshTime:', refreshTime)

  setTimeout(() => {
    console.log('persistSession function dispatch refreshSession')
    dispatch(refreshSession())
  }, refreshTime)
}
