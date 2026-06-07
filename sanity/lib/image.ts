import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env' // Your Sanity environment variables

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: any) => {
  return imageBuilder.image(source)
}