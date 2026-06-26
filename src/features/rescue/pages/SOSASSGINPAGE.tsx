import { useNavigate, useParams } from "react-router-dom";
import SOSAssignPage from "../components/SOSAssignPage";

export const SOSASSGINPAGE = () => {
  const navigate = useNavigate();
  const { sosId } = useParams();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
    console.log("PARAM SOS ID =", sosId);
console.log("CURRENT URL =", window.location.pathname);
  return (
    <SOSAssignPage
      sosId={sosId || ""}
      teamId={user.teamId}
      onBack={() => navigate(-1)}
      onAssigned={() => navigate("/Home")}
    />
  );
};