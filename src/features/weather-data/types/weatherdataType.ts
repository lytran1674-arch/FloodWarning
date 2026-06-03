export interface Weather_datas{
    madulieu: string
    rainfall: number
    temperature: number
    humidity: number
    pressure: number
    dewpoint: number
    evapotranspiration:number
    wind_speed:number
    wind_direction:number
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
