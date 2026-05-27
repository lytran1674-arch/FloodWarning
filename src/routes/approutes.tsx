import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Area } from "../features/areas/pages/Area"
import { LoginForm } from "../features/auth/components/LoginForm"

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route element={<MainLayout />}>          
          <Route path="/areas-management" element={<Area />} />
          <Route path="/weather-data/:area_id"/>
          <Route path="/home" element={<Area />} />
        </Route>
      </Routes>

  )
}

export default AppRoutes