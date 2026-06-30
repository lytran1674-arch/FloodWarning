import React from 'react'
import { AlertCard } from '../components/AlertCard'
import { Title } from '../components/Title'
import { Status } from '../components/Status'

export const AlertPage = () => {
  return (
    <div>
        <Title/>
        <Status/>
        <AlertCard/>
    </div>
  )
}
