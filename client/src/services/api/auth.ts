import { fetchApi } from "./base";
import { SignUpData, SignInData } from "../../types/db";

/**
 * @description Uses fetchApi to make simplified auth related requests to the server
 * @returns Server response
 */
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
    }),

    refreshSession: () =>
        fetchApi('/auth/refresh', {
        method: 'POST',
    }),

    getGithubLoginUrl: () => 
        fetchApi('/auth/github/login', {
        method: 'GET',
    }),
}
