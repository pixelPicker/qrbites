import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='grid place-items-center h-full font-Aeonik-Regular'>Nothin in the dashboard bruv.</div>
}
