interface LicenseToken {
  email: string
  features: string[]
  expiration?: string
  licenseType: string
  activatedAt: string
}

interface DecodedToken {
  payload: LicenseToken
  isValid: boolean
  isExpired: boolean
}

export class AuthService {
  private static readonly TOKEN_KEY = "license_token"
  private static readonly API_BASE_URL = "https://api.example.com"

  // Store token securely in localStorage
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  // Get token from localStorage
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  // Remove token from localStorage
  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
    }
  }

  // Decode JWT token (simplified - in production use a proper JWT library)
  static decodeToken(token: string): DecodedToken {
    try {
      // Simple base64 decode for demo purposes
      // In production, use a proper JWT library like jose or jsonwebtoken
      const parts = token.split(".")
      if (parts.length !== 3) {
        return { payload: {} as LicenseToken, isValid: false, isExpired: false }
      }

      const payload = JSON.parse(atob(parts[1])) as LicenseToken
      const now = new Date().getTime() / 1000
      const expiration = payload.expiration ? new Date(payload.expiration).getTime() / 1000 : null
      const isExpired = expiration ? now > expiration : false

      return {
        payload,
        isValid: true,
        isExpired,
      }
    } catch (error) {
      return { payload: {} as LicenseToken, isValid: false, isExpired: false }
    }
  }

  // Check if user has valid license
  static isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    const decoded = this.decodeToken(token)
    return decoded.isValid && !decoded.isExpired
  }

  // Get current license info
  static getLicenseInfo(): LicenseToken | null {
    const token = this.getToken()
    if (!token) return null

    const decoded = this.decodeToken(token)
    return decoded.isValid && !decoded.isExpired ? decoded.payload : null
  }

  // Activate license with external API
  static async activateLicense(
    email: string,
    licenseKey: string,
  ): Promise<{
    success: boolean
    token?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/licence/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          licenceKey: licenseKey,
        }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        return {
          success: true,
          token: data.token,
        }
      } else {
        return {
          success: false,
          error: data.message || "Activation failed",
        }
      }
    } catch (error) {
      // Simulate API response for demo purposes
      // In production, this would be a real API call
      return this.simulateActivation(email, licenseKey)
    }
  }

  // Simulate activation for demo purposes
  private static simulateActivation(
    email: string,
    licenseKey: string,
  ): Promise<{
    success: boolean
    token?: string
    error?: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different responses based on license key
        if (licenseKey === "INVALID") {
          resolve({
            success: false,
            error: "Invalid license key",
          })
        } else if (licenseKey === "EXPIRED") {
          resolve({
            success: false,
            error: "License key has expired",
          })
        } else if (licenseKey === "LIMIT") {
          resolve({
            success: false,
            error: "Activation limit reached for this license",
          })
        } else {
          // Generate a mock JWT token
          const payload = {
            email,
            features: ["premium-features", "cloud-backup", "priority-support"],
            licenseType: "Pro License",
            activatedAt: new Date().toISOString(),
            expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          }

          // Create a mock JWT (in production, this would come from your backend)
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mock_signature`

          resolve({
            success: true,
            token: mockToken,
          })
        }
      }, 1500) // Simulate network delay
    })
  }
}
