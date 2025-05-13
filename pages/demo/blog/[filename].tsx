// THIS FILE HAS BEEN GENERATED WITH THE TINA CLI.
// @ts-nocheck
// This is a demo file once you have tina setup feel free to delete this file

import Head from 'next/head'
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import client from '../../../tina/__generated__/client'

const BlogPage = (props) => {
  // If there was an error fetching data, show a simple message
  if (props.error) {
    return (
      <>
        <Head>
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.7/tailwind.min.css'
            integrity='sha512-y6ZMKFUQrn+UUEVoqYe8ApScqbjuhjqzTuwUMEGMDuhS2niI8KA3vhH2LenreqJXQS+iIXVTRL2iaNfJbDNA1Q=='
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
        </Head>
        <div className="text-center p-8">
          <h1 className='text-3xl m-8 text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            TinaCMS Demo Page
          </h1>
          <p className="mb-4">This is a demo page for TinaCMS. The TinaCMS API is not connected yet.</p>
          <div className='bg-yellow-100 p-4 rounded-md mb-8 inline-block'>
            <h2 className="font-bold">TinaCMS Connection Issue</h2>
            <p>There was a problem connecting to TinaCMS API. This could be due to:</p>
            <ul className="list-disc pl-5 text-left mt-2">
              <li>Invalid TinaCMS Client ID or Token</li>
              <li>Missing environment variables</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
          <div className='bg-green-100 p-4 rounded-md mb-8 inline-block'>
            Need help setting up TinaCMS?
            <a
              href='https://tina.io/guides/tina-cloud/getting-started/overview/'
              className='text-blue-500 ml-1 underline'
            >
              Check out this guide
            </a>
          </div>
        </div>
      </>
    )
  }

  // If data was successfully fetched, render the actual content
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <>
      <Head>
        {/* Tailwind CDN */}
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.7/tailwind.min.css'
          integrity='sha512-y6ZMKFUQrn+UUEVoqYe8ApScqbjuhjqzTuwUMEGMDuhS2niI8KA3vhH2LenreqJXQS+iIXVTRL2iaNfJbDNA1Q=='
          crossOrigin='anonymous'
          referrerPolicy='no-referrer'
        />
      </Head>
      <div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h1 className='text-3xl m-8 text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            {data.post.title}
          </h1>
          <ContentSection content={data.post.body}></ContentSection>
        </div>
        <div className='bg-green-100 text-center p-4'>
          Lost and looking for a place to start?
          <a
            href='https://tina.io/guides/tina-cloud/getting-started/overview/'
            className='text-blue-500 underline'
          >
            {' '}
            Check out this guide
          </a>{' '}
          to see how add TinaCMS to an existing Next.js site.
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async ({ params }) => {
  let data = {}
  let query = {}
  let variables = { relativePath: `${params.filename}.md` }
  let error = false
  
  try {
    const res = await client.queries.post(variables)
    query = res.query
    data = res.data
    variables = res.variables
  } catch (err) {
    console.error('Error connecting to TinaCMS:', err.message)
    error = true
    // Return dummy data so build can still complete
    data = {
      post: {
        title: 'Demo Post (TinaCMS Not Connected)',
        body: {
          type: 'root',
          children: [
            {
              type: 'p',
              children: [
                { type: 'text', text: 'This is a demo post with dummy content because TinaCMS is not properly connected. Please check your TinaCMS credentials and environment variables.' }
              ]
            }
          ]
        }
      }
    }
  }

  return {
    props: {
      variables: variables,
      data: data,
      query: query,
      error: error
    },
  }
}

export const getStaticPaths = async () => {
  try {
    const postsListData = await client.queries.postConnection()
    return {
      paths: postsListData.data.postConnection.edges.map((post) => ({
        params: { filename: post.node._sys.filename },
      })),
      fallback: false,
    }
  } catch (err) {
    console.error('Error fetching post paths:', err.message)
    // Return a fallback path so build can still complete
    return {
      paths: [{ params: { filename: 'hello-world' } }],
      fallback: false,
    }
  }
}

export default BlogPage

const PageSection = (props) => {
  return (
    <>
      <h2>{props.heading}</h2>
      <p>{props.content}</p>
    </>
  )
}

const components = {
  PageSection: PageSection,
}

const ContentSection = ({ content }) => {
  return (
    <div className='relative py-16 bg-white overflow-hidden text-black'>
      <div className='hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full'>
        <div
          className='relative h-full text-lg max-w-prose mx-auto'
          aria-hidden='true'
        >
          <svg
            className='absolute top-12 left-full transform translate-x-32'
            width={404}
            height={384}
            fill='none'
            viewBox='0 0 404 384'
          >
            <defs>
              <pattern
                id='74b3fd99-0a6f-4271-bef2-e80eeafdf357'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className='text-gray-200'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill='url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)'
            />
          </svg>
          <svg
            className='absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32'
            width={404}
            height={384}
            fill='none'
            viewBox='0 0 404 384'
          >
            <defs>
              <pattern
                id='f210dbf6-a58d-4871-961e-36d5016a0f49'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className='text-gray-200'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill='url(#f210dbf6-a58d-4871-961e-36d5016a0f49)'
            />
          </svg>
          <svg
            className='absolute bottom-12 left-full transform translate-x-32'
            width={404}
            height={384}
            fill='none'
            viewBox='0 0 404 384'
          >
            <defs>
              <pattern
                id='d3eb07ae-5182-43e6-857d-35c643af9034'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className='text-gray-200'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill='url(#d3eb07ae-5182-43e6-857d-35c643af9034)'
            />
          </svg>
        </div>
      </div>
      <div className='relative px-4 sm:px-6 lg:px-8'>
        <div className='text-lg max-w-prose mx-auto'>
          <TinaMarkdown components={components} content={content} />
        </div>
      </div>
    </div>
  )
}
