import { CovidImageData } from "~/components/CamperTable";

const downloadImage = ({
  covidImageFileName = "",
  encodedImage = "",
}: CovidImageData) => {
  const link = document.createElement("a");
  link.href = `data:image/jpeg;base64,${encodedImage}`;
  link.download = covidImageFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadImage;
