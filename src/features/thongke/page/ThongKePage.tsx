import React from 'react'
import { OverviewCards } from '../component/OverViewCard'
import { ResourceCards } from '../component/ResourceCards'

export const ThongKePage = () => {
  return (
     <div className="w-full lg:m-2">
      <OverviewCards />
      <ResourceCards/>
    </div>
  )
}
