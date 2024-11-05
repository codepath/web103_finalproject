import { api } from "../services/api"

const GithubLogin = () => {
    const handleGithubLogin = async () => {
        try {
            const response = await api.auth.getGithubLoginUrl()
            console.log('GitHub login response:', response)
            window.location.href = response.url
        } catch (error) {
            console.error('Failed to start GitHub login:', error)
        }
    }

    return (
        <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 w-[250px] mt-5 bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
        >
            Continue with GitHub
        </button>
    )
}

export default GithubLogin