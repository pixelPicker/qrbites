import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/staff')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>No staff added currently</div>
}
