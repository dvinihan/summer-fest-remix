import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import downloadImage from "~/helpers/downloadImage";
import { Camper } from "../types/Camper";
import { ActionFunction, Form, useActionData, useNavigate } from "remix";
// import { getIsAdminFromUser } from "../helpers";
// import AWS from "aws-sdk";
import { useEffect } from "react";

interface Props {
  campers: Camper[];
}

export interface CovidImageData {
  covidImageFileName: string;
  encodedImage: string;
}

export const action: ActionFunction = async ({
  request,
}): Promise<CovidImageData | undefined> => {
  const body = await request.formData();
  const covidImageFileName = body.get("covidImageFileName")?.toString();

  if (!covidImageFileName) return;

  // const s3 = new AWS.S3({
  //   accessKeyId: process.env.S3_ACESS_KEY_ID,
  //   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  // });
  const params = {
    Bucket: "summerfestcovidimages",
    Key: covidImageFileName,
  };

  let encodedImage = "";
  // s3.getObject(params, (err, data) => {
  //   if (err) console.error(err);
  //   encodedImage = data.Body?.toString("base64") ?? "";
  //   // // @ts-ignore
  //   // fs.writeFileSync(covidImageFileName, data.Body);

  //   // const image = fs.readFileSync(covidImageFileName);
  //   // encodedImage = image.toString("base64");
  // });
  return { covidImageFileName, encodedImage };
};

const CamperTable = ({ campers }: Props) => {
  //   const { user } = useUser();
  //   const isAdmin = getIsAdminFromUser(user);
  const navigate = useNavigate();
  const { covidImageFileName, encodedImage } =
    useActionData<CovidImageData>() ?? {};

  useEffect(() => {
    if (encodedImage) {
      downloadImage({
        covidImageFileName: covidImageFileName ?? "",
        encodedImage: encodedImage ?? "",
      });
    }
  }, [covidImageFileName, encodedImage]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Grade just completed</TableCell>
            <TableCell>Food Alergies</TableCell>
            <TableCell>Parent or Guardian Email</TableCell>
            <TableCell>Emergency Contact Name</TableCell>
            <TableCell>Emergency Contact Number</TableCell>
            <TableCell>Roommate</TableCell>
            <TableCell>Online or Paper Registration</TableCell>
            <TableCell>Waiver Signed Status</TableCell>
            <TableCell>Waiver Signed By</TableCell>
            {/* {isAdmin && <TableCell>Room Assignment</TableCell>} */}
            <TableCell>Is Adult Leader</TableCell>
            <TableCell>Student Leadership Track</TableCell>
            <TableCell>Camp Attending</TableCell>
            <TableCell>COVID Image Type</TableCell>
            <TableCell>COVID Image</TableCell>
            <TableCell sx={{ minWidth: 300 }}>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campers.map((camper: Camper) => (
            <TableRow key={camper.id}>
              <TableCell>
                <Button onClick={() => navigate(`/camperEdit?id=${camper.id}`)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell>{camper.first_name}</TableCell>
              <TableCell>{camper.last_name}</TableCell>
              <TableCell>{camper.gender}</TableCell>
              <TableCell>{camper.birthday}</TableCell>
              <TableCell>{camper.grade_completed}</TableCell>
              <TableCell>{camper.allergies}</TableCell>
              <TableCell>{camper.parent_email}</TableCell>
              <TableCell>{camper.emergency_name}</TableCell>
              <TableCell>{camper.emergency_number}</TableCell>
              <TableCell>{camper.roommate}</TableCell>

              <TableCell>{camper.registration}</TableCell>
              <TableCell>{camper.signed_status}</TableCell>
              <TableCell>{camper.signed_by}</TableCell>
              {/* {isAdmin && <TableCell>{camper.room}</TableCell>} */}
              <TableCell>{camper.adult_leader}</TableCell>
              <TableCell>{camper.student_leadership_track}</TableCell>
              <TableCell>{camper.camp_attending}</TableCell>
              <TableCell>{camper.covid_image_type}</TableCell>
              <TableCell>
                {camper.covid_image_file_name && (
                  <Form method="post">
                    <input
                      style={{ display: "none" }}
                      name="covidImageFileName"
                      value={camper.covid_image_file_name}
                    />
                    <Button type="submit" style={{ cursor: "pointer" }}>
                      Download
                    </Button>
                  </Form>
                )}
              </TableCell>
              <TableCell sx={{ minWidth: 300 }}>{camper.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CamperTable;
