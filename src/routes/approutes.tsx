import { BrowserRouter, Routes, Route } from "react-router-dom"
import {AreaPage} from "../features/areas/pages/AreaPage"

import { Area } from "../features/areas/pages/Area"

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/"      element={<AreaPage />} />
        <Route
          path="/quanlyareas"
          element={<Area />}
        />
      </Routes>

  )
}

export default AppRoutes