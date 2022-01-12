import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
// import { getIsAdminFromContext } from "../src/helpers";
// import { withAdmin } from "../src/components/withAdmin";
import { useAppContext } from "~/context/AppContext";
import { LoaderFunction, useLoaderData, useNavigate } from "remix";
import connectToDatabase from "~/utils/db.server";
import { Group } from "../types/Group";
import { Camper } from "~/types/Camper";
import { User } from "~/types/User";
import { downloadCSV } from "~/helpers/downloadCsv";

export const loader: LoaderFunction = async ({}) => {
  // const sessionCookie = context.req.headers.cookie;
  //     const isAdmin = getIsAdminFromContext(context);
  //   if (isAdmin) {
  const db = await connectToDatabase();
  const [groups, campers, users] = await Promise.all([
    db.collection("groups").find().toArray(),
    db.collection("campers").find().toArray(),
    db.collection("users").find().toArray(),
  ]);
  //   }

  return { groups, campers, users };
};

const Admin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsLoading } = useAppContext();
  const { groups, campers, users } =
    useLoaderData<{ groups: Group[]; campers: Camper[]; users: User[] }>();

  const handleDownloadCsv = async () => {
    setIsLoading(true);
    await downloadCSV({ groups, campers, users, isAdmin: true });
    setIsLoading(false);
  };

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Group Name</TableCell>
                  <TableCell>Leader</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {groups.map((group: Group) =>
                  group.id === 1 ? null : (
                    <TableRow key={group.id}>
                      <TableCell>
                        <Button
                          onClick={() => navigate(`/groupEdit/${group.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>{group.group_name}</TableCell>
                      <TableCell>{group.leader_name}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Button onClick={() => navigate("/groupAdd")}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a Group</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => navigate("/userAdd")}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>Add a User</Container>
                </Paper>
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => navigate("/users")}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                  <Container>View All Users</Container>
                </Paper>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button onClick={handleDownloadCsv} type="button">
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Download All Data</Container>
            </Paper>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Admin;
