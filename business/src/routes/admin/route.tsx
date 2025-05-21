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

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, authIsLoading } = useAuthStoreContext((state) => state);
  const { restaurant, restaurantIsLoading } = useRestaurantStoreContext(
    (state) => state
  );
  const navigate = useNavigate();
  console.log({ user, restaurant, line: "index.tsx - 25" });

  //   if (authIsLoading || restaurantIsLoading) {
  //     return (
  //       <div className="w-screen grid place-items-center min-h-screen">
  //         <SpinningCircles speed={0.7} />
  //       </div>
  //     );
  //   }
  //   if (!user) {
  //     console.log({ authIsLoading, user });

  //     navigate({ to: "/auth/login" });
  //     return;
  //   }
  //   if (!restaurant) {
  //     console.log({ restaurantIsLoading, restaurant });

  //     navigate({ to: "/restaurant/create" });
  //     return;
  //   }
  const dummyUser: User = {
    email: "ipsumlorem1290@gmail.com",
    id: "1",
    role: "admin",
    username: "ipsum",
    profilePic: null,
    alias: null,
  };
  return <AppSidebar user={user ?? dummyUser} />;
}

export function AppSidebar({ user }: { user: User }) {
  return (
    <SidebarProvider>
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
                    className="flex items-center gap-5 !px-4 !py-6 hover:!bg-light-green/60 !text-base rounded-md transition"
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
          <Link to="/admin/profile" className="flex items-center gap-5 hover:bg-light-green/60 rounded-lg !py-3 !px-4 my-auto">
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
