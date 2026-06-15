import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { requestNotificationPermission } from "../utils/firebaseNotification";

export const useFirebaseNotification = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);
};