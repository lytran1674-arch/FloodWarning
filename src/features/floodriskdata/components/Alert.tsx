import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  MdEmail,
  MdNotifications,
} from "react-icons/md";
import axios from "axios";

interface AlertItem {
  tenkhuvuc: string;
  riskLevel: string;
  channel: string;
  status: string;
  createdAt: string;
}

export default function Alert() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

   useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const userId = user.id;
      const token = user.accessToken;

      if (!userId) {
        console.error("Không tìm thấy userId");
        return;
      }

      const res = await axios.get(
        `https://api-lulut.io.vn/alert/my-alerts/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlerts(
        res.data?.result?.content || []
      );
    } catch (error) {
      console.error(
        "Lỗi tải danh sách cảnh báo:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts =
    filter === "ALL"
      ? alerts
      : alerts.filter(
          (item) => item.riskLevel === filter
        );

  const getRiskColor = (
    riskLevel: string
  ) => {
    switch (riskLevel) {
      case "HIGH":
        return "bg-red-100 text-red-600";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";

      case "LOW":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "SENT":
        return "text-green-600";

      case "PENDING":
        return "text-yellow-600";

      case "FAILED":
        return "text-red-600";

      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

        <div className="flex gap-2">

          <Button
            onClick={() =>
              setFilter("ALL")
            }
          >
            Tất cả
          </Button>

          <Button
            onClick={() =>
              setFilter("HIGH")
            }
          >
            HIGH
          </Button>

          <Button
            onClick={() =>
              setFilter("MEDIUM")
            }
          >
            MEDIUM
          </Button>

          <Button
            onClick={() =>
              setFilter("LOW")
            }
          >
            LOW
          </Button>

        </div>

      </div>

      {loading ? (
        <div className="text-center">
          Đang tải...
        </div>
      ) : (
        <div className="space-y-4">

          {filteredAlerts.map(
            (item, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  bg-white
                  p-4
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >

                <div className="flex gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">

                    {item.channel ===
                    "EMAIL" ? (
                      <MdEmail
                        size={24}
                      />
                    ) : (
                      <MdNotifications
                        size={24}
                      />
                    )}

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getRiskColor(
                          item.riskLevel
                        )}`}
                      >
                        {item.riskLevel}
                      </span>

                      <h3 className="font-semibold">
                        {
                          item.tenkhuvuc
                        }
                      </h3>

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Kênh gửi:{" "}
                      {item.channel}
                    </p>

                    <p className="text-sm text-slate-500">
                      {new Date(
                        item.createdAt
                      ).toLocaleString(
                        "vi-VN"
                      )}
                    </p>

                  </div>

                </div>

                <div
                  className={`font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </div>

              </div>
            )
          )}

          {filteredAlerts.length ===
            0 && (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              Không có cảnh báo
            </div>
          )}

        </div>
      )}
    </div>
  );
}