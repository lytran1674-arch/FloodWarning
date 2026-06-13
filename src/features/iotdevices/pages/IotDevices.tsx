

import { SearchBar } from "../../../components/ui/SearchBar";
import { IotDeviceTable } from "../components/IotDeviceTable";
import { useIotDevice } from "../hooks/useIotDevice";
import type { IotDevice } from "../types/iotdeviceType";

export const IotDevices = () => {
const {iotdevice,loading,handleApprove,showRejectConfirm}=useIotDevice();
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Quản lý thiết bị IoT
        </h1>
      </div>
      <div>
        <SearchBar value="iotdevice"
        onChange={}/>
      </div>

   

      {!loading &&  (
        <IotDeviceTable
          data={iotdevice}
          onApprove={(device: IotDevice) => handleApprove(device.id)}
        onReject={(device: IotDevice) => showRejectConfirm(device.id)}
        />
      )}
    </div>
  );
};