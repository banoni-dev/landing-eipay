"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, CheckCircle, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AuthGuard from "@/components/auth-guard"
import { SimpleAuthService } from "@/lib/auth-simple"

export default function LicenseActivationPage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseKey.trim()) {
      setError("License key is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await SimpleAuthService.activateLicense(licenseKey)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/user-dashboard")
        }, 2000)
      } else {
        setError(result.error || "License activation failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">License Activated!</h2>
                  <p className="text-slate-600 mb-4">
                    Your license has been successfully activated. Redirecting to dashboard...
                  </p>
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Activate License</h1>
              <p className="text-slate-600">Enter your license key to activate premium features</p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>License Activation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="licenseKey">
                      License Key <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="licenseKey"
                      type="text"
                      value={licenseKey}
                      onChange={(e) => {
                        setLicenseKey(e.target.value)
                        if (error) setError("")
                      }}
                      className={error ? "border-red-500" : ""}
                      placeholder="Enter your license key"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Activating License...
                      </>
                    ) : (
                      "Activate License"
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Demo License Keys:</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <code className="bg-white px-2 py-1 rounded">DEMO-12345</code> - Valid license
                    </div>
                    <div>
                      <code className="bg-white px-2 py-1 rounded">PRO-67890</code> - Pro license
                    </div>
                  </div>
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
