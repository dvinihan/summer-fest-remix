import { Container, Paper, Typography } from "@mui/material";
import { PROD_BASE_URL } from "~/constants/index";

const PageError = () => (
  <Container maxWidth="xl">
    <Paper sx={{ padding: "20px" }}>
      <Typography>
        This is not a valid page state. You must have gotten here by accident.
        Hit the back button or return to{" "}
        <a href={PROD_BASE_URL}>{PROD_BASE_URL}</a>
      </Typography>
    </Paper>
  </Container>
);

export default PageError;
