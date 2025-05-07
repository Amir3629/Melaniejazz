"use client"

import { Suspense } from 'react'
import React from 'react'
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PaymentForm from "@/app/components/payment-form"

const PaymentContent = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get('orderId') || null

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl text-white mb-8">Complete Payment</h1>
        <PaymentForm orderId={orderId} />
      </div>
    </div>
  )
}

const PaymentClient = () => {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading payment form...</div>}>
      <PaymentContent />
    </Suspense>
  )
} 

export default PaymentClient;
