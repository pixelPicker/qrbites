import { useAuthStoreContext } from '@/store/authContext'
import { useRestaurantStoreContext } from '@/store/restaurantContext';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthStoreContext(state => state);
  const { restaurant} = useRestaurantStoreContext(state => state);
  const navigate = useNavigate();

  if(!user) {
    navigate({to: "/auth/login"})
    return;
  } 
  if(!restaurant ) {
    navigate({to: "/restaurant/create"})
    return;
  }
  
  return (
    <>
      <h1>{user.username}</h1>
      <h1>{restaurant.name}</h1>
    </>
  )
}
