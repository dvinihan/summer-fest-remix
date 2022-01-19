import GroupForm from "~/components/GroupForm";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import FormError from "~/components/FormError";
import { downloadCSV } from "~/helpers/downloadCsv";
import PageError from "~/components/PageError";
import CamperTable from "~/components/CamperTable";
import { Group } from "~/types/Group";
import { useAppContext } from "~/context/AppContext";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
} from "remix";
import connectToDatabase from "~/utils/db.server";
import { useEffect } from "react";
import { User } from "~/types/User";
import { Camper } from "~/types/Camper";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.groupId) {
    throw new Response("Not a valid group ID", {
      status: 404,
    });
  }

  const db = await connectToDatabase();
  const groupId = parseInt(params.groupId);

  const [groups, campers, users] = await Promise.all([
    db.collection("groups").find({ id: groupId }).toArray(),
    db.collection("campers").find({ group_id: groupId }).toArray(),
    db.collection("users").find().toArray(),
  ]);
  return { group: groups[0], campers, users };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const updatedGroup = new Group(Object.fromEntries(body));

  try {
    const db = await connectToDatabase();
    await db
      .collection("groups")
      .updateOne({ id: updatedGroup.id }, { $set: updatedGroup });
    return { data: updatedGroup };
  } catch (e) {
    return json(
      { error: { message: "Sorry, we couldn't create the group" } },
      { status: 500 }
    );
  }
};

const GroupEdit = () => {
  const { group, campers, users } =
    useLoaderData<{ group: Group; campers: Camper[]; users: User[] }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { setToastMessage } = useAppContext();
  const { data, error } = useActionData<{ data: Group; error: Error }>() ?? {};
  const transition = useTransition();

  useEffect(() => {
    if (data) {
      setToastMessage("Group successfully saved.");
    }
  }, [data, transition.state]);

  if (!group) {
    return <PageError />;
  }

  return (
    <Container>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item marginBottom={theme.spacing(2)}>
          <GroupForm initialGroup={group} />
        </Grid>
        {error && (
          <Grid item>
            <FormError />
          </Grid>
        )}

        <Grid item>
          <Typography variant="h4" gutterBottom>
            Campers
          </Typography>
        </Grid>

        <CamperTable campers={campers} />

        <Grid item>
          <Button onClick={() => navigate(`/camperAdd?groupId=${group.id}`)}>
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Add a Camper</Container>
            </Paper>
          </Button>
        </Grid>

        <Grid item>
          <Button
            onClick={() => downloadCSV({ groups: [group], campers, users })}
          >
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>
                Download an Excel file with all your campers
              </Container>
            </Paper>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GroupEdit;
