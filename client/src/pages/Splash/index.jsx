import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignInWithGoogleButton from "../../components/SignInWithGoogleButton";
import Stack from "@mui/material/Stack";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import pawmodoroIcon from "/pawmodoro.png";
import { AttentionSeeker } from "react-awesome-reveal";

export default function Splash() {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isSignInHovered, setIsSignInHovered] = useState(false);
	const [hoverAnimationKey, setHoverAnimationKey] = useState(0);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);


	// Change the background color to red for the splash page
	useEffect(() => {
		document.documentElement.classList.add("splash-page");
		document.body.classList.add("splash-page");

		return () => {
			document.documentElement.classList.remove("splash-page");
			document.body.classList.remove("splash-page");
		};
	}, []);

	const signInButton = (
		<SignInWithGoogleButton
			buttonSx={{
				bgcolor: "common.white",
				color: "primary.main",
				"&:hover": {
					bgcolor: "common.white",
				},
				"& .MuiSvgIcon-root": {
					color: "inherit",
				},
				"& .MuiTypography-root": {
					color: "inherit",
				},
			}}
		/>
	);

	return (
		<Box
			sx={{
				minHeight: "100svh",
				width: "100%",
				maxWidth: "none",
				alignSelf: "stretch",
				boxSizing: "border-box",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: 3,
				px: 2,
				bgcolor: "primary.main",
				color: "common.white",
				"& .MuiTypography-root": {
					color: "inherit",
				},
			}}
		>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					justifyContent: "center",
					alignItems: "center",
					color: "inherit",
				}}
			>
				<AttentionSeeker effect="bounce">
					<Box component="img" src={pawmodoroIcon} sx={{ width: "10em" }} />
				</AttentionSeeker>
				<Typography variant="h1">Pawmodoro</Typography>
			</Stack>

			<Stack
				justifyContent="center"
				alignItems="center"
				sx={{ width: "50%", color: "inherit", marginBottom: "2%" }}
				spacing={3}
			>
				<Typography>Welcome to Pawmodoro!</Typography>
				<Typography>
					Pawmodoro is a gamified study timer experience utilizing the Pomodoro
					technique.
				</Typography>
				<Typography>
					In Pawmodoro, the player has a loyal, energetic pet. During study
					sessions, their pet will play, and during breaks, they come back with
					rewards. The player can use these rewards and resources to obtain
					items, decorations, and upgrades for their pet's energy.
				</Typography>
				<Typography>
					Pawmodoro is built to gamify the Pomodoro Technique, creating a
					satisfying balance of productivity and entertainment. Users have one
					more thing to look forward to during their breaks and can romanticize
					the work they do.
				</Typography>
				<Typography>
					Pawmodoro was inspired by the desire to have a more entertaining
					studying/working experience. Finding joy and aesthetic pleasure in
					work results in increased productivity, and a more fulfilling
					experience. By gamifying productivity, players will look forward to
					the ways Pawmodoro rewards them for working hard (and taking breaks)!
				</Typography>
			</Stack>

			<Box
				sx={{ display: "inline-flex" }}
				onMouseEnter={() => {
					setIsSignInHovered(true);
					setHoverAnimationKey((prev) => prev + 1);
				}}
				onMouseLeave={() => setIsSignInHovered(false)}
			>
				{isSignInHovered ? (
					<AttentionSeeker key={hoverAnimationKey} effect="tada" triggerOnce>
						{signInButton}
					</AttentionSeeker>
				) : (
					signInButton
				)}
			</Box>
		</Box>
	);
}
