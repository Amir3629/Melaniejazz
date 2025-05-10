import React from 'react'
import Image from 'next/image'
import { getImagePath } from '../utils/image-path'

type Node = {
  type: string
  children?: Node[]
  text?: string
  url?: string
  alt?: string
  src?: string
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
  format?: 'center' | 'end' | 'justify' | 'start'
  [key: string]: any
}

type RichTextContent = {
  type: string
  children: Node[]
}

const RichText = ({ content }: { content: RichTextContent }) => {
  if (!content || !content.children) {
    return null
  }

  return (
    <div className="rich-text prose prose-invert max-w-none">
      {content.children.map((node, index) => (
        <React.Fragment key={index}>
          {renderNode(node)}
        </React.Fragment>
      ))}
    </div>
  )
}

const renderNode = (node: Node): React.ReactNode => {
  const { type, children } = node

  // Text node
  if (type === 'text') {
    let text = node.text || ''
    
    // Apply formatting
    if (node.bold) {
      text = <strong>{text}</strong>
    }
    if (node.italic) {
      text = <em>{text}</em>
    }
    if (node.underline) {
      text = <u>{text}</u>
    }
    if (node.strikethrough) {
      text = <s>{text}</s>
    }
    if (node.code) {
      text = <code>{text}</code>
    }

    return text
  }

  // Handle different block types
  switch (type) {
    case 'h1':
      return <h1>{renderChildren(children)}</h1>
    case 'h2':
      return <h2>{renderChildren(children)}</h2>
    case 'h3':
      return <h3>{renderChildren(children)}</h3>
    case 'h4':
      return <h4>{renderChildren(children)}</h4>
    case 'h5':
      return <h5>{renderChildren(children)}</h5>
    case 'h6':
      return <h6>{renderChildren(children)}</h6>
    case 'blockquote':
      return <blockquote>{renderChildren(children)}</blockquote>
    case 'ul':
      return <ul>{renderChildren(children)}</ul>
    case 'ol':
      return <ol>{renderChildren(children)}</ol>
    case 'li':
      return <li>{renderChildren(children)}</li>
    case 'p':
      return <p>{renderChildren(children)}</p>
    case 'a':
      return (
        <a href={node.url} target={node.url?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
          {renderChildren(children)}
        </a>
      )
    case 'img':
      return (
        <div className="relative w-full h-64 md:h-96 my-8">
          <Image
            src={getImagePath(node.src || '')}
            alt={node.alt || 'Image'}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )
    case 'hr':
      return <hr className="my-8" />
    default:
      return renderChildren(children)
  }
}

const renderChildren = (children?: Node[]): React.ReactNode => {
  if (!children) {
    return null
  }
  
  return children.map((node, index) => (
    <React.Fragment key={index}>
      {renderNode(node)}
    </React.Fragment>
  ))
}

export default RichText 