import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/billing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/billing"!</div>
}
