import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Building2, Bird, Package, Scissors, LogOut, Egg, Crown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = { title: string; icon: React.ElementType; path: string; roles?: string[] };

const allNavItems: NavItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, path: "/" },
  { title: "Coopératives", icon: Building2, path: "/cooperatives" },
  { title: "Lots d'élevage", icon: Bird, path: "/flocks" },
  { title: "Conditionnement", icon: Package, path: "/packaging", roles: ["super_admin", "conditioning_operator", "cooperative_manager"] },
  { title: "Abattage", icon: Scissors, path: "/slaughter", roles: ["super_admin", "abattoir_operator", "cooperative_manager"] },
];

const roleConfig: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
  super_admin: { label: "Super Admin", icon: Crown, colorClass: "text-primary-foreground gradient-gold" },
  cooperative_manager: { label: "Gérant Coop.", icon: ShieldCheck, colorClass: "bg-emerald text-foreground" },
  hatchery_tech: { label: "Tech. Couvoir", icon: Bird, colorClass: "bg-secondary text-gold-light" },
  conditioning_operator: { label: "Op. Conditionn.", icon: Package, colorClass: "bg-secondary text-gold-light" },
  abattoir_operator: { label: "Op. Abattoir", icon: Scissors, colorClass: "bg-secondary text-gold-light" },
};

export function AppSidebar() {
  const { user, roles, signOut, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = allNavItems.filter((item) => {
    if (!item.roles) return true;
    if (hasRole("super_admin")) return true;
    return item.roles.some((r) => hasRole(r as any));
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-5 border-b border-gold">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="gradient-gold p-2.5 rounded-xl glow-gold"
          >
            <Egg className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <p className="text-sm font-bold font-display text-foreground tracking-wide">BIOVOLAILLES</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Union Trace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gradient-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gold-light/50 uppercase tracking-widest text-[10px] font-semibold px-5 pt-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 mt-1">
            <SidebarMenu>
              {visibleItems.map((navItem, i) => {
                const active = location.pathname === navItem.path;
                return (
                  <SidebarMenuItem key={navItem.path}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => navigate(navItem.path)}
                      tooltip={navItem.title}
                      className={`transition-all duration-200 rounded-lg ${
                        active
                          ? "bg-sidebar-accent text-gold border-gold-strong border"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <navItem.icon className={`h-4 w-4 ${active ? "text-gold" : ""}`} />
                      <span className="font-medium">{navItem.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gold space-y-3">
        <div className="space-y-2">
          <p className="text-xs text-sidebar-foreground truncate font-medium">{user?.email}</p>
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => {
              const config = roleConfig[r];
              if (!config) return null;
              return (
                <span
                  key={r}
                  className={`inline-flex items-center gap-1 text-[10px] rounded-md px-2 py-0.5 font-semibold ${config.colorClass}`}
                >
                  <config.icon className="h-3 w-3" />
                  {config.label}
                </span>
              );
            })}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
