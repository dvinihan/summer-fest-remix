import { Container, Grid } from "@mui/material";
import GroupForm from "~/components/GroupForm";
import FormError from "~/components/FormError";
import { Group } from "~/types/Group";
import { useAppContext } from "~/context/AppContext";
import {
  ActionFunction,
  json,
  useActionData,
  useNavigate,
  useTransition,
} from "remix";
import { useEffect } from "react";
import connectToDatabase from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const group_name = body.get("group_name");
  const leader_name = body.get("leader_name");

  try {
    const db = await connectToDatabase();

    const groupsCounter = await db
      .collection<{ count: number }>("counters")
      .findOne({ collection: "groups" });
    const count = groupsCounter?.count ?? 0;

    const newCount = count + 1;

    const newGroup = new Group({ group_name, leader_name, id: newCount });

    await db.collection("groups").insertOne(newGroup);
    await db
      .collection("counters")
      .updateOne({ collection: "groups" }, { $set: { count: newCount } });

    return { data: { id: newCount } };
  } catch (e) {
    return json(
      { error: { message: "Could not save group" } },
      { status: 500 }
    );
  }
};

const GroupAdd = () => {
  const navigate = useNavigate();
  const { setToastMessage } = useAppContext();
  const { data, error } =
    useActionData<{ data?: Group; error?: Error }>() ?? {};

  useEffect(() => {
    if (data) {
      navigate(`/groupEdit/${data.id}`);
      setToastMessage("Group successfully saved.");
    }
  }, [data]);

  return (
    <Container>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <GroupForm />
        </Grid>

        {error && (
          <Grid item>
            <FormError />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default GroupAdd;
