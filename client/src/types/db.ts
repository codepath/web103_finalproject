export interface User {
    id: string
    email: string
    user_name: string
    first_name: string
    last_name: string
    image_url?: string | null
    created_at?: string
    last_login?: string
    last_updated?: string
    failed_login_attempts?: number | 0
}

export interface SignUpData {
    email: string
    password: string
    user_name: string
    first_name: string
    last_name: string
}

export interface SignInData {
    user_name: string
    password: string
}