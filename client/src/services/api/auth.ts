import { fetchApi } from "./base";
import { SignUpData, SignInData } from "../../types/db";

export const authApi = {
    signUp: (user: SignUpData) =>
        fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(user),
    }),

    signIn: (user: SignInData) =>
        fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(user),
    }),

    signOut: () =>
        fetchApi('/auth/logout', {
        method: 'POST',
        credentials: 'include',
    }),

    refreshSession: () =>
        fetchApi('/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Includes website saved cookies in the request, *refresh token*
    }),
}
