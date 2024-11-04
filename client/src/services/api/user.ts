import { fetchApi } from './base'

export const userApi = {
  getMe: (access_token: string) =>
    fetchApi('/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),
}