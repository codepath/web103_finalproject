import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import pawmodoroIcon from "/pawmodoro.png";

export default function NavBar() {
	const navigate = useNavigate();

	return (
		<AppBar>
			<Toolbar
				sx={{
					height: 75,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-evenly",
				}}
			>
				<IconButton aria-label="Shop" sx={{ color: "#FFFFFF" }} onClick={() => navigate("/shop")}>
					<ShoppingCart />
				</IconButton>

				<Stack direction="row" spacing={1} sx={{ justifyContent: "center", alignItems: "center" }}>
					<Box component="img" src={pawmodoroIcon} sx={{ width: "3em" }} />
					<Typography variant="h4" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
						Pawmodoro
					</Typography>
				</Stack>

				<IconButton
					aria-label="Profile"
					sx={{ color: "#FFFFFF" }}
					onClick={() => navigate("/profile")}
				>
					<AccountCircle />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
