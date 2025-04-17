import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const homeComponent = () => (
  <>
    <div>
      <h1>Root Route</h1>
      <p>Hellow</p>
    </div>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({
  component: homeComponent,
});
