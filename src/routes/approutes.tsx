import {  Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Area } from "../features/areas/pages/Area"

import { WeatherDataPage } from "../features/weather-data/pages/WeatherDataPage"
import { LoginPage } from "../features/auth/pages/LoginPage"
import { FormSOS } from "../features/citizen/component/FormSOS"

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



const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route element={<MainLayout />}>          
          <Route path="/areas-management" element={<Area />} />
          <Route path="/weather-data/:area_id"/>
          <Route path="/home" element={<Area />} />
          <Route path="/weather-data" element={<WeatherDataPage/>}/>
          <Route path="/iot-device" element={<IotDevices/>}/>
         <Route path="/flood-risk" element={<FloodRisk/>} />
         {/*CITIZEN */}
        <Route path="/dashboard" element={<Home/>}/> 
         <Route path="/request-sos" element={<FormSOS />}/>

         <Route path="/rescue-management" element={<ResTeamPage/>}/>
        <Route path="/res-teams/:teamId/groups"element={<ResGroupPage />}/>
        <Route path="/res-groups/:groupId/members" element={<GroupMembersPage />}/>
        <Route path="/create-team" element={<CreateTeam />}/>

        <Route path="/team-management" element={<HomeRescue />}/>
        
        </Route>
      </Routes>

  )
}

export default AppRoutes