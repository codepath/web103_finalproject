import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
    palette: {
        primary: {
            main: "#FC7474",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#74B8FC",
            contrastText: "#FFFFFF",
        }
    },
    typography: {
        fontFamily: `"Spinnaker", "Roboto", "Helvetica", "Arial", sans-serif`
    }
})

