"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { SimpleAuthService } from "@/lib/auth-simple"
import { LicenseService } from "@/lib/license-service"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    licenceKey: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isActivatingLicense, setIsActivatingLicense] = useState(false)
  const [apiError, setApiError] = useState("")
  const [licenseStatus, setLicenseStatus] = useState<{
    activated: boolean
    message: string
    type: "success" | "error" | ""
  }>({
    activated: false,
    message: "",
    type: ""
  })
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    if (SimpleAuthService.isAuthenticated()) {
      router.push("/user-dashboard")
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
    // Reset license status when license key changes
    if (field === "licenceKey" && licenseStatus.message) {
      setLicenseStatus({ activated: false, message: "", type: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // License key is now required
    if (!formData.licenceKey.trim()) {
      newErrors.licenceKey = "License key is required"
    } else if (!LicenseService.isValidLicenseKey(formData.licenceKey)) {
      newErrors.licenceKey = "Please enter a valid license key"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLicenseActivation = async () => {
    if (!formData.email.trim()) {
      setLicenseStatus({
        activated: false,
        message: "Please enter your email first",
        type: "error"
      })
      return { success: false }
    }

    if (!formData.licenceKey.trim()) {
      setLicenseStatus({
        activated: false,
        message: "License key is required",
        type: "error"
      })
      return { success: false }
    }

    setIsActivatingLicense(true)
    setLicenseStatus({ activated: false, message: "", type: "" })

    try {
      const result = await LicenseService.activateLicense(formData.email, formData.licenceKey)
      
      if (result.success) {
        // Store license info for later use
        if (result.data) {
          LicenseService.storeLicenseInfo(result.data)
        }
        
        setLicenseStatus({
          activated: true,
          message: "License activated successfully! You can now create your account.",
          type: "success"
        })
        return { success: true, licenseData: result.data }
      } else {
        setLicenseStatus({
          activated: false,
          message: result.error || "License activation failed. Please check your license key.",
          type: "error"
        })
        return { success: false }
      }
    } catch (error) {
      setLicenseStatus({
        activated: false,
        message: "License activation failed. Please check your connection and try again.",
        type: "error"
      })
      return { success: false }
    } finally {
      setIsActivatingLicense(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Check if license is activated
    if (!licenseStatus.activated) {
      setApiError("Please activate your license first before creating an account.")
      return
    }

    setIsLoading(true)
    setApiError("")

    try {
      // Register user (license already activated)
      const result = await SimpleAuthService.register(formData.email, formData.password)

      if (result.success && result.user) {
        SimpleAuthService.setUser(result.user)
        
        setLicenseStatus({
          activated: true,
          message: "Account created successfully with activated license!",
          type: "success"
        })
        
        // Redirect after short delay to show success message
        setTimeout(() => {
          router.push("/user-dashboard")
        }, 1500)
      } else {
        setApiError(result.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      setApiError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Activate License</h1>
            <p className="text-slate-600">Activate your license and create your account</p>
            <p className="text-sm text-amber-600 mt-2 font-medium">
              Please use the email address associated with your license key
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>License Activation & Account Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">
                    Email Address (associated with license) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="Enter the email linked to your license"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  <p className="text-xs text-slate-500 mt-1">
                    This must be the same email address used when purchasing your license
                  </p>
                </div>

                <div>
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Enter your password (min 6 characters)"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <Label htmlFor="licenceKey">
                    License Key <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="licenceKey"
                      type="text"
                      value={formData.licenceKey}
                      onChange={(e) => handleInputChange("licenceKey", e.target.value)}
                      className={errors.licenceKey ? "border-red-500" : ""}
                      placeholder="Enter your license key"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLicenseActivation}
                      disabled={!formData.email.trim() || !formData.licenceKey.trim() || isActivatingLicense || licenseStatus.activated}
                      className="whitespace-nowrap"
                    >
                      {isActivatingLicense ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Activating...
                        </>
                      ) : licenseStatus.activated ? (
                        "Activated"
                      ) : (
                        "Activate"
                      )}
                    </Button>
                  </div>
                  {errors.licenceKey && <p className="text-red-500 text-sm mt-1">{errors.licenceKey}</p>}
                </div>

                {/* License Status Alert */}
                {licenseStatus.message && (
                  <Alert variant={licenseStatus.type === "error" ? "destructive" : "default"} 
                        className={licenseStatus.type === "success" ? "border-green-200 bg-green-50" : ""}>
                    {licenseStatus.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className={licenseStatus.type === "success" ? "text-green-800" : ""}>
                      {licenseStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {apiError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{apiError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  disabled={isLoading || !licenseStatus.activated}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Completing Setup...
                    </>
                  ) : (
                    "Complete Account Setup"
                  )}
                </Button>

                {!licenseStatus.activated && (
                  <p className="text-sm text-slate-600 text-center">
                    You must activate your license first using the email associated with it
                  </p>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>

              
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
