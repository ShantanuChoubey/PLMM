import { useEffect } from 'react'

const DEFAULT_TITLE = 'PLMM — Peer Learning & Mentor Matching'
const DEFAULT_DESCRIPTION = 'Peer Learning & Mentor Matching Platform — find the right mentor, learn faster, grow together.'

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | PLMM` : DEFAULT_TITLE

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description)
    }

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', title ? `${title} | PLMM` : DEFAULT_TITLE)

    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) {
      ogDescription = document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description')
      document.head.appendChild(ogDescription)
    }
    ogDescription.setAttribute('content', description || DEFAULT_DESCRIPTION)

    return () => {
      document.title = DEFAULT_TITLE
      if (metaDescription) metaDescription.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [title, description])
}
