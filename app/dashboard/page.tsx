"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, User, Calendar, CheckCircle, LogOut, Cloud, Database, Headphones, Palette } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import RouteGuard from "@/components/route-guard"
import { AuthService } from "@/lib/auth"
import { useRouter } from "next/navigation"

const featureIcons: Record<string, React.ReactNode> = {
  "premium-features": <Shield className="w-4 h-4" />,
  "cloud-backup": <Cloud className="w-4 h-4" />,
  "advanced-analytics": <Database className="w-4 h-4" />,
  "priority-support": <Headphones className="w-4 h-4" />,
  "custom-themes": <Palette className="w-4 h-4" />,
}

const featureNames: Record<string, string> = {
  "premium-features": "Premium Features",
  "cloud-backup": "Cloud Backup",
  "advanced-analytics": "Advanced Analytics",
  "priority-support": "Priority Support",
  "custom-themes": "Custom Themes",
}

export default function DashboardPage() {
  const [licenseInfo, setLicenseInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const info = AuthService.getLicenseInfo()
    setLicenseInfo(info)
  }, [])

  const handleLogout = () => {
    AuthService.removeToken()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome, your license is active!</h1>
              <p className="text-slate-600">Your license has been successfully activated on this device</p>
            </div>

            <Alert className="mb-8 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                You're now activated on this device and have full access to your licensed features.
              </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* License Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    License Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Email</Label>
                    <p className="text-lg">{licenseInfo?.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-600">License Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{licenseInfo?.licenseType}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-600">Activated On</Label>
                    <p className="text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {licenseInfo?.activatedAt && formatDate(licenseInfo.activatedAt)}
                    </p>
                  </div>

                  {licenseInfo?.expiration && (
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Expires On</Label>
                      <p className="text-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {formatDate(licenseInfo.expiration)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enabled Features */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Enabled Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {licenseInfo?.features?.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {featureIcons[feature] || <Shield className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{featureNames[feature] || feature}</p>
                          <p className="text-sm text-slate-600">Active</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <Card className="mt-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => router.push("/product")}>
                    Upgrade License
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/activate")}>
                    Activate on Another Device
                  </Button>
                  <Button variant="destructive" onClick={handleLogout} className="sm:ml-auto">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </RouteGuard>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
