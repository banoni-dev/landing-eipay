"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Key, CheckCircle, ArrowRight } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AuthGuard from "@/components/auth-guard"
import { SimpleAuthService } from "@/lib/auth-simple"

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [license, setLicense] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = SimpleAuthService.getUser()
    const currentLicense = SimpleAuthService.getLicense()
    setUser(currentUser)
    setLicense(currentLicense)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome, {user?.email}!</h1>
              <p className="text-slate-600">Manage your account and licenses from your dashboard</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Account Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email Address</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Account Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* License Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    License Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {license ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-slate-600">License Key</label>
                        <p className="text-lg font-mono">{license.licenseKey}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Activated On</label>
                        <p className="text-lg">{formatDate(license.activatedAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Features</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {license.features?.map((feature: string) => (
                            <Badge key={feature} variant="outline">
                              {feature.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Key className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-4">No license activated yet</p>
                      <Button asChild>
                        <Link href="/license-activation">
                          Activate License
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/license-activation" className="flex flex-col items-center gap-2">
                      <Key className="w-6 h-6" />
                      <span>Activate License</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/product" className="flex flex-col items-center gap-2">
                      <Shield className="w-6 h-6" />
                      <span>View Products</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="#" className="flex flex-col items-center gap-2">
                      <User className="w-6 h-6" />
                      <span>Account Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
}
