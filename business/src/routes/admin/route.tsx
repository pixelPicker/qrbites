import { LuUser } from "react-icons/lu";
import {
  LuCreditCard,
  LuLayoutDashboard,
  LuQrCode,
  LuScrollText,
  LuSettings2,
  LuUsers,
  LuUtensils,
} from "react-icons/lu";
import Logo from "@/components/custom/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStoreContext } from "@/store/authContext";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideBarChart3 } from "lucide-react";
import { SpinningCircles } from "react-loading-icons";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, authIsLoading } = useAuthStoreContext((state) => state);
  const { restaurant, restaurantIsLoading } = useRestaurantStoreContext(
    (state) => state
  );
  const navigate = useNavigate();

  if (authIsLoading || restaurantIsLoading) {
    return (
      <div className="w-screen bg-dark-what grid place-items-center min-h-screen">
        <SpinningCircles speed={0.7} />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/auth/login" });
    return;
  }

  if (!restaurant) {
    navigate({ to: "/restaurant/create" });
    return;
  }
  return <AppSidebar user={user} />;
}

export function AppSidebar({ user }: { user: User }) {
  return (
    <SidebarProvider className="max-h-screen overflow-hidden">
      <Sidebar
        collapsible="none"
        className="border-gray-what font-Aeonik-Regular text-hmm-black h-screen"
      >
        {/* Header */}
        <SidebarHeader className="min-h-16 flex !flex-row justify-between items-center !px-4 !border-b-2 border-gray-what">
          <Link to="/">
            <Logo size="small" />
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <SidebarMenu className="flex flex-col gap-2 !pt-4 !px-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/80 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuLayoutDashboard className="scale-150" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuScrollText className="scale-150" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/menu"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuUtensils className="scale-150" />
                    <span>Menu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/tables"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuQrCode className="scale-150" />
                    <span>Tables</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/staff"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuUsers className="scale-150" />
                    <span>Staff</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/billing"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LuCreditCard className="scale-150" />
                    <span>Billing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/analytics"
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
                    activeProps={{ className: "bg-the-green/60" }}
                    activeOptions={{ exact: true }}
                  >
                    <LucideBarChart3 className="scale-150" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="h-16 !border-t-2 font-Aeonik-Regular border-gray-what">
          <Link
            to="/admin/profile"
            className="flex items-center gap-5 hover:bg-light-green/60 rounded-lg !py-3 !px-4 my-auto"
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <LuUser className="text-hmm-black scale-150" />
            )}
            <div>
              {" "}
              <p>Profile</p>
            </div>
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="bg-gray-what flex-1">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
