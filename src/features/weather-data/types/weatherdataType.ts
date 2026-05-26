export interface Weather_datas{
    madulieu: string
    rain: number
    temp: number
    humidity: number
    pressure: number
    cloud: number
    thoigian: Date
    area_id: string
}

export interface CreateWeatherDataPayload{
     rain: number
    temp: number
    humidity: number
    pressure: number
    cloud: number
    thoigian: Date
    area_id: string
}

export interface UpdateWeatherDataPayLoad
    extends CreateWeatherDataPayload{
        madulieu: string
}
