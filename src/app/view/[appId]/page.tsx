/* eslint-disable @next/next/no-img-element */
import { getApp } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import InstallButton from './install-button'

export const dynamic = 'force-dynamic'

type Props = {
  params: { appId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await getApp(params.appId)
  if (!app) return {}
  
  return {
    title: app.name,
    description: app.description,
    manifest: `/api/manifest/${app.id}`,
    themeColor: app.theme_color || '#000000',
  }
}

export default async function ViewAppPage({ params }: Props) {
  const app = await getApp(params.appId)
  
  if (!app) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center" style={{ backgroundColor: app.theme_color || '#fff' }}>
      {app.icon_url && <img src={app.icon_url} alt={app.name} className="w-24 h-24 mb-4 rounded-xl shadow-lg" />}
      <h1 className="text-2xl font-bold mb-2">{app.name}</h1>
      <p className="mb-8">{app.description}</p>
      
      <InstallButton appId={app.id} vapidKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!} />
    </div>
  )
}
