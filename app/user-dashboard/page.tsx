"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Clock, CheckCircle, Users, Crown, LogOut } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { SimpleAuthService } from "@/lib/auth-simple"

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [license, setLicense] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (!SimpleAuthService.isAuthenticated()) {
      router.push("/login")
      return
    }

    // Get user and license info
    const currentUser = SimpleAuthService.getUser()
    const currentLicense = SimpleAuthService.getLicense()
    
    setUser(currentUser)
    setLicense(currentLicense)
  }, [router])

  const handleLogout = () => {
    SimpleAuthService.removeUser()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
                <p className="text-slate-600 mt-1">
                  Manage your account and license information
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Account ID</label>
                    <p className="text-slate-500 font-mono text-sm">#{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Status */}
            {license && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    License Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro License Active
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-600">License Key</label>
                      <p className="text-slate-500 font-mono text-sm">
                        {license.licenseKey?.substring(0, 8)}...
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Features</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {license.features?.map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600">Activated</label>
                      <p className="text-slate-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(license.activatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {license.expiresAt && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Expires</label>
                        <p className="text-slate-500 text-sm">
                          {new Date(license.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Security Settings</span>
                  <span className="text-xs text-slate-500">Manage your account security</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Profile Settings</span>
                  <span className="text-xs text-slate-500">Update your profile information</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <span className="font-medium">License Details</span>
                  <span className="text-xs text-slate-500">View detailed license information</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
