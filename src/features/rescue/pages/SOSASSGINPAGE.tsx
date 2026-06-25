
import SOSAssignPage from '../components/SOSAssignPage'
import { useNavigate } from 'react-router-dom'


export const SOSASSGINPAGE = () => {
   const navigate=useNavigate();
  return (
   <SOSAssignPage
  sosId="019eee54-a700-72ef-a50f-3a3b2e806cf7"
  teamId="019ed44a-9412-7001-9516-fcca54215135"
  onBack={() => navigate(-1)}
  onAssigned={() => navigate("/Home")}
/>
  )
}
