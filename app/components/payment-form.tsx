"use client"

import { useState } from 'react'

interface PaymentFormProps {
  orderId: string | null
}

export default function PaymentForm({ orderId }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Payment Details</h2>
      <div className="space-y-4">
        {orderId && (
          <div className="text-gray-300">
            <span className="font-medium">Order ID:</span> {orderId}
          </div>
        )}
        <div className="text-gray-300">
          Please complete your payment to finalize your booking.
        </div>
        <button
          onClick={() => setIsProcessing(true)}
          disabled={isProcessing}
          className="w-full px-6 py-3 bg-[#C8A97E] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  )
} 