import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              ProLicense
            </Link>
            <p className="text-slate-400 max-w-md">
              Professional licensing solutions for modern businesses. Get access to premium features and unlock your
              full potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/product" className="block text-slate-400 hover:text-white transition-colors">
                Product
              </Link>
              <Link href="#" className="block text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="block text-slate-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 ProLicense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
