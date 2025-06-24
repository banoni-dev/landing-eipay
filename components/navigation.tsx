"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { SimpleAuthService } from "@/lib/auth-simple"
import { useState, useEffect } from "react"

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(SimpleAuthService.isAuthenticated())
  }, [])

  const handleLogout = () => {
    SimpleAuthService.removeUser()
    setIsAuthenticated(false)
    router.push("/login")
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Product" },
    ...(isAuthenticated ? [{ href: "/user-dashboard", label: "Dashboard" }] : [{ href: "/login", label: "Login" }]),
    { href: "#contact", label: "Contact" },
  ]

  const pathname = usePathname()

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            ProLicense
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-slate-600 hover:text-slate-900 transition-colors",
                  pathname === item.href && "text-blue-600 font-medium",
                )}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button asChild variant="default" size="sm">
                <Link href="/activate">Get Started</Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg text-slate-600 hover:text-slate-900 transition-colors",
                      pathname === item.href && "text-blue-600 font-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Button asChild className="justify-start">
                    <Link href="/activate">Get Started</Link>
                  </Button>
                )}
                {isAuthenticated && (
                  <Button variant="outline" onClick={handleLogout} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navigation
