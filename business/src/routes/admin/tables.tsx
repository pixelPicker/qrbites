import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tables')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Que habla inges</div>
}
