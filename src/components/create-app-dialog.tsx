'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApp } from '@/lib/actions'

export function CreateAppDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
      await createApp(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create App</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
          <DialogDescription>
            Enter the details for your new PWA wrapper.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" placeholder="My App" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target_url" className="text-right">
              Target URL
            </Label>
            <Input id="target_url" name="target_url" placeholder="https://example.com" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon_url" className="text-right">
              Icon URL
            </Label>
            <Input id="icon_url" name="icon_url" placeholder="https://example.com/icon.png" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme_color" className="text-right">
              Theme Color
            </Label>
            <Input id="theme_color" name="theme_color" placeholder="#000000" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Create App</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
