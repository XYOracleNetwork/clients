/* eslint-disable complexity */
import { assertEx } from '@xylabs/assert'
import { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { JsonObject } from '@xylabs/object'

import { getBlogPostWitnessNode } from './getBlogPostWitnessNode'
import { isXmlWithMeta } from '@xyo-network/xml-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { getArchivist } from '../../Archivists'

export interface MediumBlogPostFields {
  category?: string[]
  contentEncoded?: string
  creator?: string
  published?: string
  title?: string
  updated?: string
  url?: string
}

export const MediumBlogPostSchema = 'network.xyo.medium.rss.blog.post'
export type MediumBlogPostSchema = typeof MediumBlogPostSchema

export type MediumBlogPost = Payload<MediumBlogPostFields, MediumBlogPostSchema>

// TODO: This should be a Sentinel that includes a diviner to itemize the individual blog posts
// and a sentinel to report the blog posts individually.  Right now we're doing it inline
// because if the sentinel reports all the values at once the HTTP request will be too large
// and we don't have a way to report individual results sequentially with a Sentinel.
// So in this method we're artificially limiting the number of blog posts that can be reported
// at once.
export const reportMediumRssBlogPosts = async (xml: Payload[]): Promise<Payload[]> => {
  const rss = xml.find(isXmlWithMeta)
  // If there's no RSS feed, return an empty array
  if (!rss) return []
  const items = (rss?.xml?.rss as { channel?: { item?: JsonObject[] }[] })?.channel?.[0]?.item ?? []
  const blogPosts: Payload[] = []
  // If there's no items, return an empty array
  if (items.length === 0) return blogPosts
  const archivist = await getArchivist()
  const node = await getBlogPostWitnessNode()
  const sentinelInstance = asSentinelInstance(await node.resolve('ReportXyoMediumRssArticle'))
  const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
  for (const item of items) {
    const blogPost = await itemToMediumBlogPost(item)
    if (!blogPost) continue
    // Check for each article if it has already been reported
    const hash = await PayloadBuilder.dataHash(blogPost)
    const existing = await archivist.get([hash])
    if (existing.length === 0) {
      const [bw, ...result] = await sentinel.report([blogPost])
      blogPosts.push(bw, ...result)
    }
  }
  // Return the newly inserted blog posts
  return blogPosts
}

const itemToMediumBlogPost = async (item: JsonObject): Promise<MediumBlogPost | undefined> => {
  const category = item?.category as string[] | undefined
  const contentEncoded = (item?.['content:encoded'] as string[] | undefined)?.[0] as string | undefined
  const creator = (item?.['dc:creator'] as string[] | undefined)?.[0] as string | undefined
  const published = (item?.pubDate as string[] | undefined)?.[0] as string | undefined
  const title = (item?.title as string[] | undefined)?.[0] as string | undefined
  const updated = (item?.['atom:updated'] as string[] | undefined)?.[0] as string | undefined
  const url = (item?.guid as Array<{ _: string }> | undefined)?.[0]?._ as string | undefined
  if (category && contentEncoded && creator && published && title && updated && url)
    return await PayloadBuilder.build<MediumBlogPost>({ ...item, schema: MediumBlogPostSchema })
  return undefined
}
