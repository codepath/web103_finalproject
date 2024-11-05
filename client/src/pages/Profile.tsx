import { useAppSelector } from "../store/hooks"

const Profile = () => {
    const user = useAppSelector((state) => state.user.user)
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-blue-600">Profile</h1>
            {
                user && <p className="text-2xl font-regular">Welcome, {user.first_name}</p>
            }
            {
                user.image_url &&
                <img src={user.image_url} alt="avatar" className="rounded-full w-20 h-20" />
            }
            <p className="text-2xl font-regular">Welcome to the profile page</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

export default Profile