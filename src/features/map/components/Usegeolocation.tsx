// features/map/components/GeoMap.tsx
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { AreaWithRisk } from "../types/mapType"
import { RISK_COLORS } from "../types/mapType"

// Fix Leaflet default icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon   from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
})

interface GeoMapProps {
  areas?:          AreaWithRisk[]
  userAreaId?:     string
  provinceName?:   string
  loading?:        boolean
  className?:      string
  onAreaClick?:    (area: AreaWithRisk) => void
  currentLat?:     number | null
  currentLon?:     number | null
  showCurrentPin?: boolean
  centerOnUser?:   boolean
}

const GeoMap = ({
  areas           = [],
  userAreaId,
  provinceName,
  loading         = false,
  className       = "",
  onAreaClick,
  currentLat,
  currentLon,
  showCurrentPin  = true,
  centerOnUser    = false,
}: GeoMapProps) => {
  const mapRef        = useRef<L.Map | null>(null)
  const layerRef      = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const divRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current || mapRef.current) return

    mapRef.current = L.map(divRef.current, {
      center:      [16.047, 108.206],
      zoom:        6,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom:     19,
    }).addTo(mapRef.current)

    layerRef.current = L.layerGroup().addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return
    layerRef.current.clearLayers()
    if (areas.length === 0) return

    const bounds: L.LatLngBounds[] = []

    areas.forEach(area => {
      if (!area.geometry) return
      const isUserArea = area.id === userAreaId
      const colors     = RISK_COLORS[area.riskLevel]

      const layer = L.geoJSON(area.geometry as any, {
        style: {
          fillColor:   colors.fill,
          fillOpacity: 0.6,
          color:       isUserArea ? "#1E40AF" : colors.stroke,
          weight:      isUserArea ? 3 : 1.5,
        },
      })

      layer.bindTooltip(
        `<div style="font-size:13px;font-weight:500">${area.tenkhuvuc}</div>
         <div style="font-size:12px;color:${colors.stroke}">${colors.label}</div>
         ${isUserArea ? '<div style="font-size:11px;color:#1E40AF">📍 Khu vực của bạn</div>' : ""}`,
        { sticky: true, opacity: 0.95 }
      )

      layer.on("click",     () => onAreaClick?.(area))
      layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.85, weight: 2.5 }))
      layer.on("mouseout",  () => layer.setStyle({ fillOpacity: 0.6, weight: isUserArea ? 3 : 1.5 }))
      layer.addTo(layerRef.current!)

      try { bounds.push(layer.getBounds()) } catch {}
    })

    if (bounds.length > 0) {
      const combined = bounds.reduce((acc, b) => acc.extend(b))
      mapRef.current.fitBounds(combined, { padding: [20, 20], animate: true })
    }
  }, [areas, userAreaId, onAreaClick])

  // Marker vị trí hiện tại
  useEffect(() => {
    if (!mapRef.current) return

    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
      userMarkerRef.current = null
    }

    if (!showCurrentPin || currentLat == null || currentLon == null) return

    const locationIcon = L.divIcon({
      html: `<div style="
        width:18px;height:18px;
        background:#2563EB;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 0 3px rgba(37,99,235,0.35),0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      className:   "",
      iconSize:    [18, 18],
      iconAnchor:  [9, 9],
      popupAnchor: [0, -12],
    })

    userMarkerRef.current = L.marker([currentLat, currentLon], { icon: locationIcon })
      .addTo(mapRef.current)
      .bindPopup(
        `<div style="font-size:13px;font-weight:500;color:#1E40AF">📍 Vị trí của bạn</div>
         <div style="font-size:11px;color:#64748B;margin-top:2px">
           ${currentLat.toFixed(5)}, ${currentLon.toFixed(5)}
         </div>`,
        { closeButton: false }
      )
      .openPopup()

    if (centerOnUser) {
      mapRef.current.flyTo([currentLat, currentLon], 14, { animate: true, duration: 1 })
    }
  }, [currentLat, currentLon, showCurrentPin, centerOnUser])

  return (
    <div className={`relative ${className}`}>
      <div ref={divRef} className="w-full h-full rounded-xl z-0" />

      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-sm">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {provinceName && (
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow text-sm font-medium text-slate-700">
          📍 {provinceName}
        </div>
      )}

      <div className="absolute bottom-2 right-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow">
        {areas.length > 0 && (
          <>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Mức độ nguy cơ</p>
            {(Object.entries(RISK_COLORS) as [keyof typeof RISK_COLORS, typeof RISK_COLORS[keyof typeof RISK_COLORS]][]).map(
              ([key, val]) => (
                <div key={key} className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-3 rounded-sm border"
                       style={{ background: val.fill, borderColor: val.stroke }}/>
                  <span className="text-xs text-slate-600">{val.label}</span>
                </div>
              )
            )}
          </>
        )}
        {currentLat != null && (
          <div className={`flex items-center gap-2 ${areas.length > 0 ? "mt-1 pt-1 border-t border-slate-100" : ""}`}>
            <div style={{
              width:12, height:12, borderRadius:"50%",
              background:"#2563EB", border:"2px solid white",
              boxShadow:"0 0 0 2px rgba(37,99,235,0.4)", flexShrink:0,
            }}/>
            <span className="text-xs text-slate-600">Vị trí của bạn</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeoMap