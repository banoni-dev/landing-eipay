interface LicenseActivationRequest {
  email: string
  licenceKey: string
  deviceFingerprint: string
}

interface LicenseActivationResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export class LicenseService {
  private static readonly API_BASE_URL = "http://localhost:5080"
  
  // Generate a hardcoded device fingerprint for demo purposes
  private static generateDeviceFingerprint(): string {
    // In production, this would be a more sophisticated fingerprint
    // combining browser info, screen resolution, timezone, etc.
    return "device-web-" + Math.random().toString(36).substr(2, 9)
  }

  // Activate license with the external API
  static async activateLicense(
    email: string,
    licenceKey: string
  ): Promise<LicenseActivationResponse> {
    try {
      const deviceFingerprint = this.generateDeviceFingerprint()
      
      const response = await fetch(`${this.API_BASE_URL}/api/v0/licence/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          licenceKey,
          deviceFingerprint,
        } as LicenseActivationRequest),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: "License activated successfully",
          data,
        }
      } else {
        return {
          success: false,
          error: data.message || data.error || "License activation failed",
        }
      }
    } catch (error) {
      console.error("License activation error:", error)
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      }
    }
  }

  // Validate license key format (basic validation)
  static isValidLicenseKey(licenceKey: string): boolean {
    if (!licenceKey || licenceKey.trim().length === 0) {
      return false
    }
    
    // Basic validation - at least 3 characters
    return licenceKey.trim().length >= 3
  }

  // Store license info in localStorage for later use
  static storeLicenseInfo(licenseData: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("activated_license", JSON.stringify({
        ...licenseData,
        activatedAt: new Date().toISOString(),
      }))
    }
  }

  // Get stored license info
  static getStoredLicenseInfo(): any {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activated_license")
      return stored ? JSON.parse(stored) : null
    }
    return null
  }
}
