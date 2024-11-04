import { fetchApi } from "./base";
import { SignUpData } from "../../types/db";

export const authApi = {
    signUp: (user: SignUpData) =>
        fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(user),
    }),

    signIn: (user: {password: string, user_name: string}) =>
        fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(user),
    }),

    signOut: (access_token: string) =>
        fetchApi('/auth/logout', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }),

    refreshSession: () =>
        fetchApi('/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Includes website saved cookies in the request, *refresh token*
    }),
}
