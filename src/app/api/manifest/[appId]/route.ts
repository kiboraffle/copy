import { getApp } from '@/lib/actions'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { appId: string } }) {
  const app = await getApp(params.appId)

  if (!app) {
    return new NextResponse('App not found', { status: 404 })
  }

  const manifest = {
    name: app.name,
    short_name: app.name,
    description: app.description || `App for ${app.name}`,
    start_url: `/view/${app.id}`,
    scope: `/view/${app.id}`,
    display: 'standalone',
    background_color: app.theme_color || '#ffffff',
    theme_color: app.theme_color || '#000000',
    icons: [
      {
        src: app.icon_url || '/icon.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: app.icon_url || '/icon.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json'
    }
  })
}
