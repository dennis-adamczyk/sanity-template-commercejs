import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import getStaticRoute from '../lib/static-routes'
import Photo from '../components/photo'

const Text = dynamic(() => import('./text'))
const Events = dynamic(() => import('./events'))
const Accordions = dynamic(() => import('./accordions'))
const FormContact = dynamic(() => import('./form-contact'))
const FormNewsletter = dynamic(() => import('./form-newsletter'))

export const Module = ({ module }) => getModule(module)

const getModule = (module) => {
  const type = module._type
  switch (type) {
    case 'textBlock':
      return <Text data={module} />
    case 'eventsList':
      return <Events data={module} />
    case 'accordionList':
      return <Accordions data={module} />
    case 'formContact':
      return <FormContact data={module} />
    case 'formNewsletter':
      return <FormNewsletter data={module} />
    default:
      return null
  }
}

export const serializers = {
  types: {
    block: (props) => {
      const { style = 'normal' } = props.node

      if (style === 'statement') {
        return <p className="is-statement">{props.children}</p>
      } else if (style === 'note') {
        return <p className="is-note">{props.children}</p>
      } else if (style === 'important') {
        return <p className="is-important">{props.children}</p>
      }

      return BlockContent.defaultSerializers.types.block(props)
    },
    figure: ({ node }) => {
      return (
        <Photo
          photo={node}
          srcsetSizes={[500, 800, 1200, 1800]}
          sizes="100vw"
          aspectCustom={{ paddingTop: 100 / node.aspectRatio + '%' }}
          width={1800}
        />
      )
    },
    horizontalRule: () => <hr />,
  },
  marks: {
    highlight: ({ mark, children }) => {
      const { color } = mark
      return <span className={color}>{children}</span>
    },

    link: ({ mark, children }) => {
      const { type, href, slug } = mark

      const isLink = !!href
      const isStatic = getStaticRoute(type ? type : '')

      return isLink ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link
          href={
            isStatic || isStatic === '' ? `/${isStatic}` : `/${slug?.current}`
          }
          scroll={false}
        >
          <a>{children}</a>
        </Link>
      )
    },

    button: ({ mark, children }) => {
      const { color, type, href, slug } = mark

      const isLink = !!href
      const isStatic = getStaticRoute(type ? type : '')

      return isLink ? (
        <a
          className={`btn ${color}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ) : (
        <Link
          href={
            isStatic || isStatic === '' ? `/${isStatic}` : `/${slug?.current}`
          }
          scroll={false}
        >
          <a className={`btn ${color}`}>{children}</a>
        </Link>
      )
    },
  },
}
