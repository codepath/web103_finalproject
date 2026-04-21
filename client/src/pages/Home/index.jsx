import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Testing from "../Testing";
import TasksDrawer from "./TasksDrawer";

export default function Home() {
    return (
        <Box>
            <Typography variant="h1">
                Home Page
            </Typography>

            <TasksDrawer/>
        </Box>
    )
}