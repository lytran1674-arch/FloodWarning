export interface AreaGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][][] | number[][][];
}

export async function fetchAreaGeometry(areaId: string): Promise<AreaGeometry | null> {
  try {
    const response = await fetch(`https://api-lulut.io.vn/area/polygon-by-id?id=${areaId}`);
    if (!response.ok) {
      console.error(`API error ${response.status}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    // Giả sử API trả về object có trường geometry: { type: "...", coordinates: [...] }
    return data.geometry as AreaGeometry;
  } catch (error) {
    console.error('Failed to fetch polygon:', error);
    return null;
  }
}