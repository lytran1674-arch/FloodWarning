import React, { useState } from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import { useArea } from '../../areas/hooks/useArea';
import { usePagination } from '../../../hooks/usePagination';
import type { Area } from '../../areas/types/areaType';
import { title } from 'process';
import type { Weather_datas } from '../types/weatherdataType';

export const WeatherDataPage = () => {
   
  const {page, setPage, totalPages,paginated}=usePagination();
  const columns=[
    {
        title:"Khu vực",
        key:"tenkhuvuc" as keyof Area
        render:(item:Area)=>(
            <div>{item.tenkhuvuc}</div>
        ),
    
    },
    {title:"Thời gian ghi nhận" as keyof Weather_datas},
    {title:"Lượng mưa (mm)" as keyof Weather_datas},
    {title:"Nhiệt độ" as keyof Weather_datas},
    {title:"Độ ẩm" as keyof Weather_datas},
    {title:"Áp suất" as keyof Weather_datas},
     
    }
  ]

  return (
    <div>
      
    </div>
  );
};
