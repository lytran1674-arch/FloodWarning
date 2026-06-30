import {  Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Area } from "../features/areas/pages/Area"

import { WeatherDataPage } from "../features/weather-data/pages/WeatherDataPage"
import { LoginPage } from "../features/auth/pages/LoginPage"


import { IotDevices } from "../features/iotdevices/pages/IotDevices"
import { FloodRisk } from "../features/floodriskdata/pages/FloodRisk"
//import { Home } from "../features/citizen/pages/Home"
import { RegisterPage } from "../features/auth/pages/RegisterPage"
import { Home } from "../features/citizen/pages/Home"
import { ResTeamPage } from "../features/rescue/pages/ResTeamPage"
import ResGroupPage from "../features/rescue/pages/ResGroupPage"
import GroupMembersPage from "../features/rescue/pages/groupMemberspage"
import { CreateTeam } from "../features/rescue/pages/CreateTeam"
import { HomeRescue } from "../features/rescue/pages/Home"

import { CreateGroupPage } from "@/features/rescue/pages/Creategrouppage"
import { SOSRequest } from "@/features/sosrequest/components/FormSos"
import { FormSOS } from "@/features/citizen/component/FormSOS"
import {RequestListPage} from "@/features/sosrequest/pages/RequestListPage"
import SuccessPage from "@/features/sosrequest/pages/SuccessPage"
import { SOSASSGINPAGE} from "@/features/rescue/pages/SOSASSGINPAGE"
import TeamSOSPage from "@/features/rescue/components/ListSOSTeam"

import { NearestDevicePage } from "@/features/citizen/component/NearestDevicePage"
import { AlertHistoryPage  } from "@/features/floodriskdata/components/AlertHistory"
import { UpdateSOSPage } from "@/features/sosrequest/pages/Updatesospage"


import { SummaryWaterPage } from "@/features/water-level/pages/SummaryWaterPage"
import { SnapShotPage } from "@/features/dataevaluation/pages/SnapShotPage"





const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/sos-request-anonymous" element={<FormSOS/>}/>
        <Route element={<MainLayout />}>          
          <Route path="/areas-management" element={<Area />} />
          <Route path="/weather-data/:area_id"/>
          <Route path="/home" element={<Area />} />
          <Route path="/weather-data" element={<WeatherDataPage/>}/>
          <Route path="/iot-device" element={<IotDevices/>}/>
         <Route path="/flood-risk" element={<FloodRisk/>} />
         {/*CITIZEN */}
        <Route path="/dashboard" element={<Home/>}/> 
         <Route path="/request-sos" element={<SOSRequest />}/>
        <Route path="/alerthistory" element={<AlertHistoryPage />}/>
         <Route path="/rescue-management" element={<ResTeamPage/>}/>
        <Route path="/res-teams/:teamId/groups"element={<ResGroupPage />}/>
        <Route path="/res-groups/:groupId/members" element={<GroupMembersPage />}/>
        <Route path="/create-team" element={<CreateTeam />}/>
        <Route path="/res-group/create" element={<CreateGroupPage />} />
        <Route path="/team-management" element={<HomeRescue />}/>
        <Route path="/sent-request" element={<RequestListPage/>}/>
        <Route path="/success" element={<SuccessPage />} />
        
        <Route
  path="/sos-assign/:sosId"
  element={<SOSASSGINPAGE />}
/>
<Route
  path="/team-sos"
  element={<TeamSOSPage />}
/>
<Route path="/water-data" element={<NearestDevicePage/>}/>

 <Route path="/update-sos/:id" element={<UpdateSOSPage />} />
 <Route path="/success" element={<SuccessPage/>}/>
 <Route path="/summary-water" element={<SummaryWaterPage/>}/>
    <Route path="/evaluation" element={<SnapShotPage/>}/>
        </Route>
       
      </Routes>

  )
}

export default AppRoutes