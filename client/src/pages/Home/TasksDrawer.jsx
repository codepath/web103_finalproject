import { Box, Button, Divider, Drawer, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function TasksDrawer() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		console.log(open);
	}, [open]);

	return (
		<Box>
			<Button
				onClick={() => {
					setOpen(!open);
				}}
				variant="contained"
			>
				Tasks
			</Button>

			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				sx={{ "& .MuiDrawer-paper": { backgroundColor: "primary.main", color: "white" } }}
			>
				<Stack
					sx={{
						width: "30vw",
						justifyContent: "center",
						alignItems: "center",
						padding: "20px",
					}}
					spacing={2}
				>
					<Typography variant="h5">Tasks</Typography>
					<Divider color="white" sx={{ width: "80%", color: "white" }} />

					<Box>
                        {/* @TODO: Implement Tasks Logic here */}
                    </Box>
                    
				</Stack>
			</Drawer>
		</Box>
	);
}
