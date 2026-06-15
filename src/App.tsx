

import { useFirebaseNotification } from "./hooks/useFirebaseNotification";
import AppRoutes from "./routes/approutes"


function App() {
    useFirebaseNotification();
  return <AppRoutes />
//  return <Area />
// return <AreaPage />
//return <Basic />

  
}

export default App 