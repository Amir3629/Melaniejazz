import { Suspense } from 'react'
import PaymentClient from './payment-client'

export const metadata = {
  title: 'Payment | Melanie Becker Vocal Coaching',
  description: 'Complete your payment for vocal coaching services with Melanie Becker.',
}

export function generateStaticParams() {
  return [
    { orderId: 'test-123' },
    { orderId: 'sample-order' }
  ]
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading payment page...</div>}>
      <PaymentClient />
    </Suspense>
  )
} 