

import { AlertPopupModal } from "./features/alert/components/AlertPopUpModal";
import { useAudioUnlockFallback } from "./features/auth/hooks/useAudioUnlockFallback";
import { AlarmPopup } from "./features/notification/component/AlarmPopup";
import { useFirebaseNotification } from "./hooks/useFirebaseNotification";
import AppRoutes from "./routes/approutes"


function App() {
    useFirebaseNotification();
   useAudioUnlockFallback();
  return(
  <>
  
       <AlarmPopup />
         <AlertPopupModal />
  <AppRoutes />
   </>
  )
//  return <Area />
// return <AreaPage />
//return <Basic />

  
}

export default App 