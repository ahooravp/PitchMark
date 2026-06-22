import createImageUrlBuilder from '@sanity/image-url'
// 1. Pull the type cleanly from the root package export
import type { SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env' // Your Sanity environment variables

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// 2. The type is successfully applied without breaking module resolution
export const urlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source)
}