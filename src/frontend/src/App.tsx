import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { LogIn, LogOut, Menu, ShieldCheck, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { BrowsePage } from "./pages/BrowsePage";
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/RegisterPage";

// ─── Layout ─────────────────────────────────

function Layout() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!identity;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display font-bold text-xl text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Wrench className="w-4 h-4" />
            </div>
            <span>help</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/browse"
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-ocid="nav.browse_link"
            >
              Browse Services
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-ocid="nav.register_link"
            >
              Register as Provider
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                data-ocid="nav.admin_link"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
                <Badge variant="secondary" className="text-xs h-4 px-1">
                  Admin
                </Badge>
              </Link>
            )}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="gap-1.5"
                data-ocid="nav.login_button"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-1.5"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-3.5 h-3.5" />
                {isLoggingIn ? "Connecting..." : "Log In"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/60 bg-card px-4 py-3 flex flex-col gap-1 animate-fade-in">
            <Link
              to="/browse"
              className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              data-ocid="nav.browse_link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Services
            </Link>
            <Link
              to="/register"
              className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              data-ocid="nav.register_link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register as Provider
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
                data-ocid="nav.admin_link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <div className="pt-2 border-t border-border/60 mt-1">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clear();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full gap-1.5"
                  data-ocid="nav.login_button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full gap-1.5"
                  data-ocid="nav.login_button"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {isLoggingIn ? "Connecting..." : "Log In"}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 font-display font-semibold text-foreground">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span>help</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/browse"
                className="hover:text-foreground transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/register"
                className="hover:text-foreground transition-colors"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Routes ──────────────────────────────────

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: BrowsePage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { search?: string; category?: string } => ({
    ...(search.search ? { search: search.search as string } : {}),
    ...(search.category ? { category: search.category as string } : {}),
  }),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  registerRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
