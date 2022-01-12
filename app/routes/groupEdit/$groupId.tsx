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
  return { groupData: groups[0], campers, users };
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const updatedGroup = new Group(Object.fromEntries(body));

  try {
    const db = await connectToDatabase();
    await db
      .collection("groups")
      .updateOne({ id: updatedGroup.id }, { $set: updatedGroup });
  } catch (e) {
    return json("Sorry, we couldn't create the group", {
      status: 500,
    });
  }

  return {};
};

const GroupEdit = () => {
  const { groupData, campers, users } = useLoaderData();
  const navigate = useNavigate();
  const theme = useTheme();
  const { setToastMessage } = useAppContext();
  const data = useActionData();
  const transition = useTransition();

  useEffect(() => {
    if (data) {
      setToastMessage("Group successfully saved.");
    }
  }, [data]);

  if (!groupData) {
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
          <GroupForm initialGroup={groupData ?? transition.submission} />
        </Grid>
        {/* 
        {(editGroupMutation.isError || deleteGroupMutation.isError) && (
          <Grid item>
            <FormError />
          </Grid>
        )} */}

        <Grid item>
          <Typography variant="h4" gutterBottom>
            Campers
          </Typography>
        </Grid>

        <CamperTable campers={campers} />

        <Grid item>
          <Button
            onClick={() => navigate(`/camperAdd?groupId=${data?.groupId}`)}
          >
            <Paper sx={{ padding: theme.spacing(1) }}>
              <Container>Add a Camper</Container>
            </Paper>
          </Button>
        </Grid>

        <Grid item>
          <Button
            onClick={() => downloadCSV({ groups: groupData, campers, users })}
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
