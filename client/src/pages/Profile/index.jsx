import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";

export default function Profile() {
    return (
        <Box>
            <Typography variant="h1">
                Profile Page
            </Typography>
            <SignInWithGoogleButton/>
        </Box>
    )
}