import { Button } from "antd";
import { SearchBar } from "../../../components/ui/SearchBar";
import { DeviceTable } from "../components/IotDeviceTable";
import { useIotDevice, type FilterStatus } from "../hooks/useIotDevice";
import type { Device } from "../types/deviceType";

import {
  Ban,
  Clock,
  Drum,
  MonitorDot,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export const IotDevices = () => {
  const {
    iotdevice,
    loading,
    handleApprove,
    showRejectConfirm,
    setFilter,
    countByStatus,
    search,setSearch
  } = useIotDevice();

  const filters: {
    label: string;
    value: FilterStatus;
    icon: LucideIcon;
  }[] = [
    { label: "Tất cả", value: "ALL", icon: Drum },
    { label: "Hoạt động", value: "ACTIVE", icon: Wifi },
    { label: "Chờ duyệt", value: "PENDING", icon: Clock },
    { label: "Đã từ chối", value: "REJECT", icon: Ban },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-start items-center gap-2">
          <MonitorDot className="text-black"/>
        <h1 className="text-xl font-semibold text-black">
        Quản lý thiết bị IoT 
        </h1>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => {
          const Icon = f.icon;

          return (
            <Button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="
                px-3 py-1.5 rounded-lg
                text-sm font-medium transition-colors
                lg:w-40 lg:h-16
                flex items-center justify-center bg-[#EFDBCB]
                lg:mr-5"
                
              >
      
              <div className="flex items-center gap-2">
                <Icon size={18} />

                <span>
                  {f.label} ({countByStatus(f.value)})
                </span>
              </div>
            </Button>
          );
        })}
      </div>
       
          <SearchBar value={search?? ""} placeholder="Tìm kiếm thiết bị" onChange={(e) => setSearch(e)}  />
     
      {!loading && (
        <DeviceTable
          data={iotdevice || []}
          onApprove={(device: Device) =>
            handleApprove(device.id)
          }
          onReject={(device: Device) =>
            showRejectConfirm(device.id)
          }
        />
      )}
    </div>
  );
};