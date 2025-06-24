"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, Loader2, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { PaymentService } from "@/lib/payment"

interface AddOn {
  id: string
  name: string
  price: number
}

const addOns: AddOn[] = [
  { id: "cloud-backup", name: "Cloud Backup", price: 45 },
  { id: "advanced-analytics", name: "Advanced Analytics", price: 75 },
  { id: "priority-support", name: "Priority Support", price: 60 },
  { id: "custom-themes", name: "Custom Themes", price: 30 },
]

export default function CheckoutPage() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string>("")

  const basePrice = 299.99

  useEffect(() => {
    // Get selected add-ons from localStorage
    const stored = localStorage.getItem("selectedAddOns")
    if (stored) {
      setSelectedAddOns(JSON.parse(stored))
    }
  }, [])

  const selectedAddOnDetails = addOns.filter((addOn) => selectedAddOns.includes(addOn.id))
  const totalPrice = basePrice + selectedAddOnDetails.reduce((total, addOn) => total + addOn.price, 0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear payment error when user makes changes
    if (paymentError) {
      setPaymentError("")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!validateForm()) return
  
    setIsProcessing(true)
    setPaymentError("")
  
    // 👇 Open a blank tab right away
    const newTab = window.open('', '_blank')
  
    try {
      const paymentData = {
        amount: Math.round(totalPrice * 100),
        description: `Software License Purchase - Pro License${selectedAddOnDetails.length > 0 ? ` + ${selectedAddOnDetails.length} add-ons` : ''}`,
        acceptedPaymentMethods: ["bank_card", "wallet"],
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phone.trim() || "+21600000000",
        email: formData.email.trim(),
        referenceId: PaymentService.generateReferenceId()
      }
  
      const response = await PaymentService.initiatePayment(paymentData)
  
      localStorage.setItem("paymentRef", response.paymentRef)
      localStorage.setItem("purchaseData", JSON.stringify({
        ...formData,
        totalPrice,
        selectedAddOns,
        referenceId: paymentData.referenceId
      }))
  
      // 👇 Redirect the already-opened tab to the payment URL
      if (newTab) {
        newTab.location.href = response.payUrl
      } else {
        setPaymentError("Popup blocked! Please allow popups for this site.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError(error instanceof Error ? error.message : "An unexpected error occurred")
      if (newTab) {
        newTab.close()
      }
    } finally {
      setIsProcessing(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
            <p className="text-slate-600">Complete your purchase to get instant access</p>
          </div>

          {paymentError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {paymentError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="border-0 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Pro License</h3>
                    <p className="text-sm text-slate-600">Base license with all premium features</p>
                  </div>
                  <span className="font-semibold">{basePrice.toFixed(2)} TND</span>
                </div>

                {selectedAddOnDetails.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Selected Add-ons</h4>
                      {selectedAddOnDetails.map((addOn) => (
                        <div key={addOn.id} className="flex justify-between items-center py-1">
                          <span className="text-sm">{addOn.name}</span>
                          <span className="text-sm font-medium">+{addOn.price} TND</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{totalPrice.toFixed(2)} TND</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure payment protected by SSL encryption</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      disabled={isProcessing}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+216XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg py-6" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </Button>

                

                  <p className="text-xs text-slate-500 text-center">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
