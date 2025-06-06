import { query } from "../db"

export interface FinancingApplication {
  id: string
  user_id: string
  financing_type: string
  amount: number
  term_months: number
  profit_rate: number
  purpose?: string
  status: string
  monthly_payment?: number
  takaful_included: boolean
  shariah_contract_type: string
  created_at: Date
  updated_at: Date
}

export async function getFinancingApplicationsByUserId(userId: string): Promise<FinancingApplication[]> {
  const result = await query("SELECT * FROM financing_applications WHERE user_id = $1 ORDER BY created_at DESC", [
    userId,
  ])

  return result.rows
}

export async function getFinancingApplicationById(id: string): Promise<FinancingApplication | null> {
  const result = await query("SELECT * FROM financing_applications WHERE id = $1", [id])

  return result.rows[0] || null
}

export async function createFinancingApplication(applicationData: {
  user_id: string
  financing_type: string
  amount: number
  term_months: number
  profit_rate: number
  purpose?: string
  takaful_included: boolean
  shariah_contract_type: string
}): Promise<FinancingApplication> {
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(
    applicationData.amount,
    applicationData.profit_rate,
    applicationData.term_months,
  )

  const result = await query(
    `INSERT INTO financing_applications (
      user_id, financing_type, amount, term_months, profit_rate, purpose,
      monthly_payment, takaful_included, shariah_contract_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      applicationData.user_id,
      applicationData.financing_type,
      applicationData.amount,
      applicationData.term_months,
      applicationData.profit_rate,
      applicationData.purpose || null,
      monthlyPayment,
      applicationData.takaful_included,
      applicationData.shariah_contract_type,
    ],
  )

  return result.rows[0]
}

export async function updateFinancingApplicationStatus(
  id: string,
  status: string,
): Promise<FinancingApplication | null> {
  const result = await query(
    `UPDATE financing_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id],
  )

  return result.rows[0] || null
}

// Helper function to calculate monthly payment
function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const monthlyRate = annualRate / 100 / 12
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  return Number.parseFloat(payment.toFixed(2))
}
