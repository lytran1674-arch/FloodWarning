import {  Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Area } from "../features/areas/pages/Area"

import { WeatherDataPage } from "../features/weather-data/pages/WeatherDataPage"
import { LoginPage } from "../features/auth/pages/LoginPage"
import { FormSos } from "../components/FormSos"

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
         <Route path="/requestsos" element={<FormSos />}/>
        <Route element={<MainLayout />}>          
          <Route path="/areas-management" element={<Area />} />
          <Route path="/weather-data/:area_id"/>
          <Route path="/home" element={<Area />} />
          <Route path="/weather-data" element={<WeatherDataPage/>}/>
         
        </Route>
      </Routes>

  )
}

export default AppRoutes