"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Cloud, Database, Headphones, Palette, Calendar, Shield, Monitor } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

interface AddOn {
  id: string
  name: string
  description: string
  price: number
  icon: React.ReactNode
}

interface License {
  license_name: string
  description: string
  max_devices: number
  duration: number
  grace_period: string
  price: number
}

const license: License = {
  license_name: "Pro License",
  description: "Access all premium features with unlimited usage and regular updates. Perfect for professional use with comprehensive functionality.",
  max_devices: 5,
  duration: 365, // days
  grace_period: "30 days",
  price: 299.99
}

const addOns: AddOn[] = [
  {
    id: "cloud-backup",
    name: "Cloud Backup",
    description: "Store your data securely in the cloud with automatic backups",
    price: 45,
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Get detailed insights and reporting with advanced analytics",
    price: 75,
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "priority-support",
    name: "Priority Support",
    description: "24/7 priority support with dedicated account manager",
    price: 60,
    icon: <Headphones className="w-5 h-5" />,
  },
  {
    id: "custom-themes",
    name: "Custom Themes",
    description: "Access to premium themes and customization options",
    price: 30,
    icon: <Palette className="w-5 h-5" />,
  },
]

export default function ProductPage() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const totalPrice =
    license.price +
    selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddOns([...selectedAddOns, addOnId])
    } else {
      setSelectedAddOns(selectedAddOns.filter((id) => id !== addOnId))
    }
  }

  const handleCheckout = () => {
    // Store selected add-ons in localStorage for checkout page
    localStorage.setItem("selectedAddOns", JSON.stringify(selectedAddOns))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Product Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{license.license_name}</h1>
            <p className="text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
              {license.description}
            </p>
            <div className="text-3xl font-bold text-blue-600">{license.price.toFixed(2)} TND</div>
          </div>

          {/* License Details */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                License Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Max Devices</div>
                    <div className="text-slate-600">{license.max_devices} devices</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Duration</div>
                    <div className="text-slate-600">{license.duration} days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Grace Period</div>
                    <div className="text-slate-600">{license.grace_period}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base Features */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Included Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>All premium features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Regular updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Standard support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons Section */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Add-on Options</CardTitle>
              <p className="text-slate-600">Enhance your license with these optional add-ons</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {addOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={addOn.id}
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {addOn.icon}
                      <label htmlFor={addOn.id} className="font-semibold cursor-pointer">
                        {addOn.name}
                      </label>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{addOn.description}</p>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">+{addOn.price} TND</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Total Price */}
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Total Price</h3>
                  <p className="text-slate-600">
                    Base license + {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600">{totalPrice.toFixed(2)} TND</div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Button */}
          <div className="text-center">
            <Button asChild size="lg" className="text-lg px-8 py-6" onClick={handleCheckout}>
              <Link href="/checkout">
                Pay Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
