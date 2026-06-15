import React from 'react'
import { TabBar } from '../component/TabBar'
import { WeatherandMap } from '../component/WeatherandMap'
import { HuongDan } from '../component/HuongDan'

export const Home = () => {
  return (
    <div>
       
        <WeatherandMap />
          <HuongDan />
    </div>
  )
}
