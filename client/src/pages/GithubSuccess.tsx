import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { setAccessToken } from '../store/slices/auth.slice'

const GithubSuccess = () => {
    const [searchParams] = useSearchParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = searchParams.get('access_token')
        
        if (accessToken) {
            dispatch(setAccessToken(accessToken))
            navigate('/profile')
        } else {
            navigate('/auth')
        }
    }, [searchParams, dispatch, navigate])

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Completing GitHub login...</p>
        </div>
    )
}

export default GithubSuccess