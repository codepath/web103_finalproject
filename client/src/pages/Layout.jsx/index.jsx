import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Box from "@mui/material/Box";
import useAuthRedirect from "../../hooks/useAuthRedirect";

export default function Layout() {

    useAuthRedirect('/splash')

    return (
        <Box>
            <NavBar/>
            <Box>
                <Outlet/>
            </Box>
        </Box>
    )
}