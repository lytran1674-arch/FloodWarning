
import {
  X,
  Cpu,
  MapPin,
  Clock3,
  Activity,
  Wifi,
} from "lucide-react";

interface Device {
  id: string;
  device_code: string;
  area_id: string;
  tenkhuvuc: string;
  ten_thietbi: string;
  nguong_canh_bao: number;
  trang_thai: string;
  lat: number;
  lon: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  device: Device;
}

export default function DeviceDetailModal({
  open,
  onClose,
  device,
}: Props) {


  if (!open) return null;

  const Item = ({
    label,
    value,
  
  }: {
    label: string;
    value: string | number;
    copyKey?: string;
  }) => (
    <div className="flex items-center justify-between py-4 border-b last:border-none">
      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className="font-medium text-slate-700 mt-1 break-all">
          {value}
        </p>
      </div>

    
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5">
      <div className="relative w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative overflow-hidden border-b">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />

          <div className="flex items-start justify-between p-8 relative">
            <div className="flex gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg">
                <Cpu size={34} />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold text-slate-800">
                    Chi tiết thiết bị
                  </h2>

                  <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 text-sm font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    ONLINE
                  </span>
                </div>

                <p className="mt-2 text-slate-500 text-lg">
                  Thông tin chi tiết và trạng thái hiện tại của thiết bị IoT
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-3 hover:bg-slate-100 transition"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-8">
          {/* Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Card trạng thái */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-7 text-white shadow-xl">
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
              <div className="absolute -right-6 bottom-6 h-24 w-24 rounded-full border border-white/20" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-white/80">
                      Trạng thái thiết bị
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-green-300 animate-pulse" />

                      <h3 className="text-4xl font-bold">
                        {device.trang_thai}
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-full bg-white/15 p-5 backdrop-blur">
                    <Wifi size={42} />
                  </div>
                </div>

                <div className="mt-10 rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Activity size={22} />

                    <span className="font-medium">
                      Thiết bị đang hoạt động bình thường
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card định danh */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <Cpu className="text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold">
                  Thông tin định danh
                </h3>
              </div>

              <Item label="ID thiết bị" value={device.id} copyKey="id" />

              <Item
                label="Mã thiết bị"
                value={device.device_code}
                copyKey="code"
              />

              <Item label="Tên thiết bị" value={device.ten_thietbi} />
            </div>
          </div>

          {/* Card khu vực */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <MapPin className="text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Thông tin khu vực
              </h3>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <Item
                  label="ID khu vực"
                  value={device.area_id}
                  copyKey="area"
                />

                <Item label="Tên khu vực" value={device.tenkhuvuc} />
              </div>

              <div>
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Ngưỡng cảnh báo
                    </p>

                    <p className="mt-1 text-3xl font-bold text-blue-600">
                      {device.nguong_canh_bao} m
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-5">
                  <div>
                    <p className="text-sm text-slate-500">
                      Trạng thái
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                      {device.trang_thai}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card thời gian & vị trí */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <Clock3 className="text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold">
                Thông tin thời gian & vị trí
              </h3>
            </div>

            <div className="grid gap-5 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-5 border">
                <p className="text-sm text-slate-500">Vĩ độ</p>

                <p className="mt-2 text-lg font-semibold">{device.lat}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border">
                <p className="text-sm text-slate-500">Kinh độ</p>

                <p className="mt-2 text-lg font-semibold">{device.lon}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border">
                <p className="text-sm text-slate-500">Ngày tạo</p>

                <p className="mt-2 text-lg font-semibold">
                  {device.createdAt}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border">
                <p className="text-sm text-slate-500">Cập nhật cuối</p>

                <p className="mt-2 text-lg font-semibold">
                  {device.updatedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t pt-6">
            <button
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}