'use server'

import { prisma } from '@/lib/prisma'
import webpush from 'web-push'
import { revalidatePath } from 'next/cache'

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  subject: 'mailto:admin@roibest.com'
}

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

export async function createApp(formData: FormData) {
  const name = formData.get('name') as string
  const target_url = formData.get('target_url') as string
  const icon_url = formData.get('icon_url') as string
  const theme_color = formData.get('theme_color') as string
  
  let user = await prisma.user.findFirst()
  if (!user) {
    try {
        user = await prisma.user.create({
            data: {
                email: 'demo@example.com',
                password_hash: 'dummy',
            }
        })
    } catch {
        // If user exists but findFirst failed or race condition
        user = await prisma.user.findFirst()
    }
  }

  if (!user) throw new Error("Could not find or create user")

  const app = await prisma.app.create({
    data: {
      name,
      target_url,
      icon_url,
      theme_color,
      user_id: user.id
    }
  })

  revalidatePath('/dashboard')
  return { success: true, app }
}

export async function getApps() {
    const user = await prisma.user.findFirst()
    if (!user) return []
    return await prisma.app.findMany({ 
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
    })
}

export async function getApp(appId: string) {
    return await prisma.app.findUnique({ where: { id: appId } })
}

export async function saveSubscriber(appId: string, subscription: { endpoint: string, keys: { auth: string, p256dh: string } }) {
  try {
      await prisma.subscriber.create({
        data: {
            app_id: appId,
            endpoint: subscription.endpoint,
            keys_auth: subscription.keys.auth,
            keys_p256dh: subscription.keys.p256dh
        }
      })
      return { success: true }
  } catch (e) {
      console.error("Error saving subscriber", e)
      return { success: false, error: String(e) }
  }
}

export async function sendPushNotification(appId: string, title: string, body: string, url: string) {
    const subscribers = await prisma.subscriber.findMany({ where: { app_id: appId } })
    
    const notificationPayload = JSON.stringify({
        title,
        body,
        url,
        icon: '/icon.png'
    })

    let successCount = 0;
    let failCount = 0;

    const promises = subscribers.map(async sub => {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                auth: sub.keys_auth,
                p256dh: sub.keys_p256dh
            }
        }
        try {
            await webpush.sendNotification(pushSubscription, notificationPayload)
            successCount++;
        } catch (err: unknown) {
            console.error('Error sending push', err)
            failCount++;
            const statusCode = (err as { statusCode?: number }).statusCode
            if (statusCode === 410 || statusCode === 404) {
                await prisma.subscriber.delete({ where: { id: sub.id } })
            }
        }
    })

    await Promise.all(promises)
    return { success: true, successCount, failCount }
}
