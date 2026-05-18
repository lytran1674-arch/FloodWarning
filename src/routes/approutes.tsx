import { BrowserRouter, Routes, Route } from "react-router-dom"
import {AreaPage} from "../features/areas/pages/AreaPage"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/areas"
          element={<AreaPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes