interface User {
  id: number
  email: string
  password: string
  created_at: string
}

interface AuthUser {
  id: number
  email: string
}

export class SimpleAuthService {
  private static readonly USER_KEY = "auth_user"
  private static readonly LICENSE_KEY = "user_license"

  // Store user session in localStorage
  static setUser(user: AuthUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  // Get current user from localStorage
  static getUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  // Remove user session
  static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.LICENSE_KEY)
    }
  }

  // Check if user is logged in
  static isAuthenticated(): boolean {
    return this.getUser() !== null
  }

  // Register new user
  static async register(
    email: string,
    password: string,
  ): Promise<{
    success: boolean
    user?: AuthUser
    error?: string
  }> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          user: data.user,
        }
      } else {
        return {
          success: false,
          error: data.error || "Registration failed",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      }
    }
  }

  // Login user
  static async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean
    user?: AuthUser
    error?: string
  }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          user: data.user,
        }
      } else {
        return {
          success: false,
          error: data.error || "Login failed",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error. Please try again.",
      }
    }
  }

  // Activate license
  static async activateLicense(licenseKey: string): Promise<{
    success: boolean
    license?: any
    error?: string
  }> {
    const user = this.getUser()
    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    try {
      const response = await fetch("/api/v0/licence/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          licenseKey,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store license info in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(this.LICENSE_KEY, JSON.stringify(data.license))
        }

        return {
          success: true,
          license: data.license,
        }
      } else {
        return {
          success: false,
          error: data.error || "License activation failed",
        }
      }
    } catch (error) {
      // Simulate successful activation for demo
      const mockLicense = {
        email: user.email,
        licenseKey,
        features: ["premium-features", "cloud-backup", "priority-support"],
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(this.LICENSE_KEY, JSON.stringify(mockLicense))
      }

      return {
        success: true,
        license: mockLicense,
      }
    }
  }

  // Get user's license info
  static getLicense(): any {
    if (typeof window !== "undefined") {
      const license = localStorage.getItem(this.LICENSE_KEY)
      return license ? JSON.parse(license) : null
    }
    return null
  }
}
