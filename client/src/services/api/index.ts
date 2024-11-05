import { authApi } from './auth'
import { userApi } from './user'

/**
 * @description API object that contains all the API services
 */
export const api = {
    auth: authApi,
    user: userApi,
}