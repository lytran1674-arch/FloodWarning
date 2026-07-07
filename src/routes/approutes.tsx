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

import {RequestListPage} from "@/features/sosrequest/pages/RequestListPage"
import SuccessPage from "@/features/sosrequest/pages/SuccessPage"
import { SOSASSGINPAGE} from "@/features/rescue/pages/SOSASSGINPAGE"
import TeamSOSPage from "@/features/rescue/components/ListSOSTeam"

import { NearestDevicePage } from "@/features/citizen/component/NearestDevicePage"
import { UpdateSOSPage } from "@/features/sosrequest/pages/Updatesospage"


import { SummaryWaterPage } from "@/features/water-level/pages/SummaryWaterPage"
import { SnapShotPage } from "@/features/dataevaluation/pages/SnapShotPage"
import { AlertPage } from "@/features/alert/pages/AlertPage"
import { SumWaterPage } from "@/features/citizen/pages/SumWater"
import  {SupportRequestListPage}  from "@/features/province_operator/pages/SuppportRequestListPage"

import { HomeProvince } from "@/features/province_operator/pages/Home"
import { SupportRequestReviewPage } from "@/features/province_operator/pages/SupportRequestReviewPage"
import ListProvinceOperatorPage from "@/features/province_operator/pages/ListProvinceOperatorPage"
import { SoSAnonymous } from "@/features/sosrequest-anonymous/components/SoSAnonymous"
import SentRequestAnonymousPage from "@/features/sosrequest-anonymous/components/Sentrequestanonymouspage"
import { MyRequestSupportPage } from "@/features/rescue/pages/MyRequestSupportPage"
import { AccountPage } from "@/features/account/pages/AccountPage"
import { InfTeamPage } from "@/features/rescue/pages/InfTeamPage"







const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/sos-request-anonymous" element={<SoSAnonymous/>}/>
        <Route path="/sent-request-anonymous" element={<SentRequestAnonymousPage />} />
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
        <Route path="/myalert" element={<AlertPage />}/>
         <Route path="/rescue-management" element={<ResTeamPage/>}/>
        <Route path="/res-teams/:teamId/groups"element={<ResGroupPage />}/>
        <Route path="/res-groups/:groupId/members" element={<GroupMembersPage />}/>
        <Route path="/create-team" element={<CreateTeam />}/>
        <Route path="/res-group/create" element={<CreateGroupPage />} />
        <Route path="/group-management" element={<ResGroupPage />}/>
        <Route path="/sent-request" element={<RequestListPage/>}/>
        <Route path="/success" element={<SuccessPage />} />
        
        <Route path="/sos-assign/:sosId"element={<SOSASSGINPAGE />}/>
        <Route path="/team-sos" element={<TeamSOSPage />}/>
        <Route path="/water-data" element={<NearestDevicePage/>}/>

        <Route path="/update-sos/:id" element={<UpdateSOSPage />} />
        <Route path="/success" element={<SuccessPage/>}/>
        <Route path="/summary-water" element={<SummaryWaterPage/>}/>
        <Route path="/sum-water" element={<SumWaterPage/>}/>
        <Route path="/evaluation" element={<SnapShotPage/>}/>
        <Route path="/homerescue" element={<HomeRescue/>}/>
        <Route path="/request-support" element={<SupportRequestListPage/>}/>
        <Route path="/support-request/:id/review" element={<SupportRequestReviewPage />} />
        <Route path="/homeprovince" element={<HomeProvince/>}/>
        {/* <Route path="/province_operator-management" element={<ProvinceOperatorListPage/>}/> */}
         <Route path="/province_operator-management" element={<ListProvinceOperatorPage/>}/>
         <Route path="/support-request" element={<MyRequestSupportPage/>}/>
        <Route path="/account" element={<AccountPage/>}/>
        <Route path="/information-team" element={<InfTeamPage/>}/>
        </Route>
       
      </Routes>

  )
}

export default AppRoutes