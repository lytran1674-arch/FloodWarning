

import { AlarmPopup } from "./features/notification/component/AlarmPopup";
import { useFirebaseNotification } from "./hooks/useFirebaseNotification";
import AppRoutes from "./routes/approutes"


function App() {
    useFirebaseNotification();
   
  return(
  <>
       <AlarmPopup />
  <AppRoutes />
   </>
  )
//  return <Area />
// return <AreaPage />
//return <Basic />

  
}

export default App 