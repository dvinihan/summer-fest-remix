import { Button, Grid, Modal, Paper, useTheme } from "@mui/material";
import { useEffect } from "react";
import { ActionFunction, useActionData } from "remix";
import { useAppContext } from "~/context/AppContext";

interface Props {
  message: string;
  onDecline: () => void;
  onAccept: () => void;
}

export const action: ActionFunction = () => {};

const DeleteModal = ({ message, onAccept, onDecline }: Props) => {
  const theme = useTheme();
  const { setToastMessage } = useAppContext();
  const data = useActionData();

  useEffect(() => {
    setToastMessage(`Group ${data.group_name} successfully deleted.`);
  }, []);

  return (
    <Modal open>
      <Paper sx={{ margin: theme.spacing(2), padding: theme.spacing(2) }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <h1>{message}</h1>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          <Grid item>
            <Button variant="contained" onClick={onDecline}>
              No
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={onAccept}>
              Yes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default DeleteModal;
