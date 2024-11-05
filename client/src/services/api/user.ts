import { fetchApi } from './base'

/**
 * @description Uses fetchApi to make simplified user related requests to the server
 * @returns Server response
 */
export const userApi = {
  getMe: (access_token: string) =>
    fetchApi('/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),
}