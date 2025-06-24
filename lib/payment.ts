interface PaymentRequest {
  amount: number
  description: string
  acceptedPaymentMethods: string[]
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  referenceId: string
}

interface PaymentResponse {
  payUrl: string
  paymentRef: string
}

export class PaymentService {
  private static readonly API_BASE_URL = 'http://localhost:5080/api/v0'

  static async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/licence/lic-std-001/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`)
      }

      const data: PaymentResponse = await response.json()
      return data
    } catch (error) {
      console.error('Payment API error:', error)
      throw new Error('Failed to initiate payment. Please try again.')
    }
  }

  static generateReferenceId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `LIC-${timestamp}-${random}`
  }
}
