import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Testing() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Mini Page
      </Button>

      <Drawer
        anchor="right"
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 420, md: 480 },
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Testing Panel</Typography>
            <Typography variant="body2" color="text.secondary">
              A mini page inside a drawer
            </Typography>
          </Box>

          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                Quick Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This drawer can hold forms, widgets, lists, or any custom React layout.
              </Typography>
            </CardContent>
          </Card>

          <TextField label="Title" fullWidth />
          <TextField label="Description" fullWidth multiline minRows={4} />

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Options
              </Typography>
              <Stack spacing={1}>
                <Button variant="outlined">Action 1</Button>
                <Button variant="outlined">Action 2</Button>
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ mt: "auto", pt: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" fullWidth>
                Save
              </Button>
              <Button variant="text" fullWidth onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}