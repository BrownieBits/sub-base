import { previewClient } from '@/lib/contentful';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Parse query string parameters
  // const { searchParams } = new URL(request.url)
  // const secret = searchParams.get('secret')
  // const slug = searchParams.get('slug')

  // if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
  //     return new Response('Invalid token', { status: 401 })
  // }

  // const response = await previewClient.getEntries({
  //     content_type: 'recipe',
  //     'fields.slug': slug
  // })
  // const recipe = response?.items?.[0]
  // if (!recipe) {
  //     return new Response('Invalid Slug', { status: 401 })
  // }
  // draftMode().enable()
  // redirect(`/${recipe.fields.slug}`)
  redirect(`/`);
}
