import Loading from '@/components/Loading'
import VerifyOtp from '@/components/VerifyOtp'
import React, { Suspense } from 'react'

const VerfiyPage = () => {

  

  return (
    <Suspense fallback={<Loading/>}>
      <VerifyOtp/> 
    </Suspense>
     
  )
}

export default VerfiyPage