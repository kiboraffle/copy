/* eslint-disable @next/next/no-img-element */
import { getApp, sendPushNotification } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function AppDetailPage({ params }: { params: { id: string } }) {
  const app = await getApp(params.id)
  
  if (!app) {
    notFound()
  }

  async function handleSendPush(formData: FormData) {
      'use server'
      const title = formData.get('title') as string
      const body = formData.get('body') as string
      const url = formData.get('url') as string
      
      await sendPushNotification(app!.id, title, body, url)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Manage App: {app.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Send Push Notification</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSendPush} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required placeholder="Hello World" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="body">Body</Label>
                        <Textarea id="body" name="body" required placeholder="This is a notification" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Target URL (Optional)</Label>
                        <Input id="url" name="url" defaultValue={app.target_url} />
                    </div>
                    <Button type="submit">Send Notification</Button>
                </form>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>App Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p><strong>Target URL:</strong> {app.target_url}</p>
                <p><strong>Public Page:</strong> <a href={`/view/${app.id}`} className="text-blue-500 hover:underline" target="_blank">/view/{app.id}</a></p>
                {app.icon_url && <img src={app.icon_url} alt="App Icon" className="w-16 h-16 rounded" />}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
