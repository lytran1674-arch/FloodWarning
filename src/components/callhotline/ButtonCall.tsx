import { useEmergency } from "../../features/emergency/hooks/useEmergency"

export function CallRescueButton() {
  const { CallHotline, loading, error, data } = useEmergency()

  return (
    <div>
      <button
        onClick={CallHotline}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Đang định vị..." : "📞 Gọi cứu hộ"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {data?.teamName && (
        <p className="mt-2 text-xs text-gray-500">
          Đội gần nhất: {data.teamName} — {data.emergencyPhone}
        </p>
      )}
    </div>
  )
}