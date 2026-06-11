import { useEffect, useState } from "react";
import type { IotDevice } from "../types/iotdeviceType";
import { iotdeviceService } from "../services/iotdeviceService";

export const useIotDevice = () => {
  const [iotdeviceApi, setIotDevice] = useState<IotDevice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIotDevice = async () => {
    try {
      setLoading(true);
      const data = await iotdeviceService.getIotDevices();
      setIotDevice(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIotDevice();
  }, []);

  return { iotdeviceApi, loading };
};
