import { Link } from "react-router-dom"
import { useAppDispatch } from "../store/hooks"
import { signOut } from "../store/slices/auth.slice"

const Home = () => {
    const dispatch = useAppDispatch()

    const handleSignOut = async () => {
        try {
            console.log("Signing out...")
            await dispatch(signOut()).unwrap()
            console.log("Sign out successful")
        } catch (error) {
            console.error("Sign out failed:", error)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-blue-600">Home</h1>
            <p className="text-2xl font-regular">Welcome to the home page</p>
            <Link to="/auth">
                <button className="border border-gray-400 p-2 my-2 w-full">
                    Go to Auth
                </button>
            </Link>
            <Link to="/profile">
                <button className="border border-gray-400 p-2 my-2 w-full">
                    Go to Profile
                </button>
            </Link>
            <button className="border border-gray-400 p-2 my-2 w-[150px]" onClick={handleSignOut}>
                Sign out
            </button>
        </div>
    )
}

export default Home