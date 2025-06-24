"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthService } from "@/lib/auth"

export default function ActivatePage() {
  const [formData, setFormData] = useState({
    email: "",
    licenseKey: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (AuthService.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) {
      setApiError("")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.licenseKey.trim()) {
      newErrors.licenseKey = "License key is required"
    } else if (formData.licenseKey.length < 8) {
      newErrors.licenseKey = "License key must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setApiError("")

    try {
      const result = await AuthService.activateLicense(formData.email, formData.licenseKey)

      if (result.success && result.token) {
        AuthService.setToken(result.token)
        setShowSuccess(true)

        // Show success message briefly before redirect
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setApiError(result.error || "Activation failed. Please try again.")
      }
    } catch (error) {
      setApiError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Activation Successful!</h2>
                <p className="text-slate-600 mb-4">
                  You're now activated on this device. Redirecting to your dashboard...
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Activate Your License</h1>
            <p className="text-slate-600">Enter your email and license key to get started</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>License Activation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="licenseKey">
                    License Key <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="licenseKey"
                    type="text"
                    value={formData.licenseKey}
                    onChange={(e) => handleInputChange("licenseKey", e.target.value)}
                    className={errors.licenseKey ? "border-red-500" : ""}
                    placeholder="Enter your license key"
                  />
                  {errors.licenseKey && <p className="text-red-500 text-sm mt-1">{errors.licenseKey}</p>}
                </div>

                {apiError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{apiError}</AlertDescription>
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
                    <code className="bg-white px-2 py-1 rounded">INVALID</code> - Invalid license
                  </div>
                  <div>
                    <code className="bg-white px-2 py-1 rounded">EXPIRED</code> - Expired license
                  </div>
                  <div>
                    <code className="bg-white px-2 py-1 rounded">LIMIT</code> - Activation limit reached
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
