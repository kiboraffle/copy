import { getApps } from '@/lib/actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { CreateAppDialog } from '@/components/create-app-dialog'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const apps = await getApps()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Apps</h1>
        <CreateAppDialog />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.target_url}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p className="text-sm text-gray-500">Subscribers: {0}</p> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/dashboard/app/${app.id}`}>Manage</Link>
              </Button>
              <Button asChild>
                <Link href={`/view/${app.id}`} target="_blank">View App</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {apps.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No apps found. Create your first one!
          </div>
        )}
      </div>
    </div>
  )
}
