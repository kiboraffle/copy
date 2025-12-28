'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { saveSubscriber } from '@/lib/actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton({ appId, vapidKey }: { appId: string, vapidKey: string }) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      
      // Register SW
      navigator.serviceWorker.register('/sw.js')
        .then(async (registration) => {
          console.log('SW registered: ', registration)
          
          // Check subscription
          const subscription = await registration.pushManager.getSubscription()
          if (subscription) {
              setIsSubscribed(true)
          }
        })
        .catch((error) => {
          console.log('SW registration failed: ', error)
        })
    }

    // Install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    })
  }, [])

  async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey)
        })
        
        await saveSubscriber(appId, JSON.parse(JSON.stringify(subscription)))
        setIsSubscribed(true)
        alert('Subscribed to notifications!')
    } catch (e) {
        console.error('Failed to subscribe', e)
        alert('Failed to subscribe. Make sure you are in a secure context (HTTPS or localhost).')
    }
  }

  async function handleInstall() {
      if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          if (outcome === 'accepted') {
              setDeferredPrompt(null)
          }
      }
  }

  if (!isSupported) return <p>Push notifications not supported on this device.</p>

  return (
    <div className="flex flex-col gap-4">
      {deferredPrompt && (
          <Button onClick={handleInstall} variant="default" size="lg">
            Install App
          </Button>
      )}
      
      {!isSubscribed ? (
        <Button onClick={subscribeToPush} variant="outline">
          Enable Notifications
        </Button>
      ) : (
        <p className="text-sm text-green-600 font-medium">Notifications Enabled ✓</p>
      )}
    </div>
  )
}
