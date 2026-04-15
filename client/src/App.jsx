import { useRoutes } from "react-router"
import BodyLayout from "./layouts/BodyLayout"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import UserProfile from "./pages/UserProfile"

function App() {

	let element = useRoutes([
		{
			path: '/',
			element: <Home />
		},
		{
			path: '/login',
			element: <Login />
		},
		{
			path: '/signup',
			element: <SignUp />
		},
		{
			path: '/profile',
			element: <UserProfile />
		}
	])

	return (
		<div className="min-h-screen flex flex-col bg-app-bg dark:bg-app-bg">
			<Navbar />
			<main className="flex-1 w-full max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<BodyLayout element={element} />
			</main>
			<Footer />
		</div>
	)
}

export default App
