import React from 'react'
import NavBar from '../../components/navbar'

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <>
        <NavBar />
        {children}
    </>
  )
}
