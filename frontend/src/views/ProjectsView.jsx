/**
 * Renders the ProjectsView component.
 * @returns {JSX.Element} The ProjectsView component.
 */
import { Container, Typography } from "@mui/material";
import Board from "../components/Board";

const ProjectsView = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Projects 🎯
      </Typography>
      <Board boardType="project" />
    </Container>
  );
};

export default ProjectsView;
