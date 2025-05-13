import Head from 'next/head'
import Link from 'next/link'

export default function DemoNoTina() {
  return (
    <>
      <Head>
        <title>Demo Page Without TinaCMS</title>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.7/tailwind.min.css'
          integrity='sha512-y6ZMKFUQrn+UUEVoqYe8ApScqbjuhjqzTuwUMEGMDuhS2niI8KA3vhH2LenreqJXQS+iIXVTRL2iaNfJbDNA1Q=='
          crossOrigin='anonymous'
          referrerPolicy='no-referrer'
        />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Demo Site
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              This is a demo page that works without TinaCMS connection
            </p>
          </div>

          <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Deployment Information
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details about the current deployment
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Environment</dt>
                  <dd className="mt-1 text-sm text-gray-900">{process.env.NODE_ENV}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Build Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date().toISOString()}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">TinaCMS Status</dt>
                  <dd className="mt-1 text-sm bg-yellow-100 p-4 rounded-md">
                    <p className="font-medium">TinaCMS is not connected</p>
                    <p className="mt-1">This page doesn't require TinaCMS to work properly.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/">
              <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// This page doesn't require any data fetching
export async function getStaticProps() {
  return {
    props: {}, // No props needed
  }
} 