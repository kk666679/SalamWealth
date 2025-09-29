import { query } from "../db"

export interface InvestmentAccount {
  id: string
  user_id: string
  investment_type: string
  amount: number
  current_value: number
  profit_rate?: number
  halal_certified: boolean
  risk_rating?: number
  created_at: Date
  updated_at: Date
}

export async function getInvestmentAccountsByUserId(userId: string): Promise<InvestmentAccount[]> {
  const result = await query("SELECT * FROM investment_accounts WHERE user_id = $1 ORDER BY created_at DESC", [userId])

  return result.rows
}

export async function getInvestmentAccountById(id: string): Promise<InvestmentAccount | null> {
  const result = await query("SELECT * FROM investment_accounts WHERE id = $1", [id])

  return result.rows[0] || null
}

export async function createInvestmentAccount(accountData: {
  user_id: string
  investment_type: string
  amount: number
  profit_rate?: number
  halal_certified?: boolean
  risk_rating?: number
}): Promise<InvestmentAccount> {
  // Set current value equal to initial amount
  const currentValue = accountData.amount

  const result = await query(
    `INSERT INTO investment_accounts (
      user_id, investment_type, amount, current_value, profit_rate, halal_certified, risk_rating
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      accountData.user_id,
      accountData.investment_type,
      accountData.amount,
      currentValue,
      accountData.profit_rate || null,
      accountData.halal_certified !== undefined ? accountData.halal_certified : true,
      accountData.risk_rating || null,
    ],
  )

  return result.rows[0]
}

export async function updateInvestmentValue(
  id: string,
  currentValue: number,
  profitRate?: number,
): Promise<InvestmentAccount | null> {
  const result = await query(
    `UPDATE investment_accounts 
     SET current_value = $1, profit_rate = $2, updated_at = NOW() 
     WHERE id = $3 
     RETURNING *`,
    [currentValue, profitRate || null, id],
  )

  return result.rows[0] || null
}

export async function getInvestmentSummaryByUserId(userId: string): Promise<{
  totalInvested: number
  totalCurrentValue: number
  averageReturn: number
  investmentsByType: Record<string, { amount: number; currentValue: number }>
}> {
  const investments = await getInvestmentAccountsByUserId(userId)

  let totalInvested = 0
  let totalCurrentValue = 0
  const investmentsByType: Record<string, { amount: number; currentValue: number }> = {}

  investments.forEach((investment) => {
    totalInvested += investment.amount
    totalCurrentValue += investment.current_value

    if (!investmentsByType[investment.investment_type]) {
      investmentsByType[investment.investment_type] = {
        amount: 0,
        currentValue: 0,
      }
    }

    investmentsByType[investment.investment_type].amount += investment.amount
    investmentsByType[investment.investment_type].currentValue += investment.current_value
  })

  const averageReturn = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0

  return {
    totalInvested,
    totalCurrentValue,
    averageReturn: Number.parseFloat(averageReturn.toFixed(2)),
    investmentsByType,
  }
}
