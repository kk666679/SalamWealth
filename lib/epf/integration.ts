// This simulates integration with the EPF (Employees Provident Fund) system
// In a real application, this would use actual API calls to the EPF service

import { createClient } from "@/lib/supabase/server"

interface EPFData {
  accountNumber: string
  account1Balance: number
  account2Balance: number
  totalBalance: number
  lastContribution: {
    date: string
    amount: number
    employer: string
  }
  withdrawalEligibility: {
    housing: boolean
    education: boolean
    retirement: boolean
  }
}

export async function getEPFData(userId: string, myKadId: string): Promise<EPFData | null> {
  try {
    const supabase = createClient()

    // Check if we have stored EPF data
    const { data: epfData } = await supabase.from("epf_integration").select("*").eq("user_id", userId).single()

    if (epfData && isTokenValid(epfData.token_expires_at)) {
      // We have valid cached data
      return {
        accountNumber: epfData.epf_number,
        account1Balance: epfData.account_1_balance,
        account2Balance: epfData.account_2_balance,
        totalBalance: epfData.account_1_balance + epfData.account_2_balance,
        lastContribution: JSON.parse(epfData.last_contribution || "{}"),
        withdrawalEligibility: JSON.parse(epfData.withdrawal_eligibility || "{}"),
      }
    }

    // In production, this would call the EPF API
    // For this example, we'll simulate the EPF data

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate a deterministic but realistic EPF number based on MyKad ID
    const epfNumber = `EPF${myKadId.substring(0, 6)}${myKadId.substring(9, 12)}`

    // Generate realistic balances based on MyKad ID
    // This is just for simulation purposes
    const hash = myKadId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const account1Balance = 50000 + (hash % 150000) // Between 50k and 200k
    const account2Balance = 10000 + (hash % 40000) // Between 10k and 50k

    const epfResult = {
      accountNumber: epfNumber,
      account1Balance,
      account2Balance,
      totalBalance: account1Balance + account2Balance,
      lastContribution: {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        amount: 1100 + (hash % 900), // Between 1100 and 2000
        employer: "Example Sdn Bhd",
      },
      withdrawalEligibility: {
        housing: account1Balance > 50000,
        education: account1Balance > 100000,
        retirement: false, // Typically based on age, not simulated here
      },
    }

    // Store in our database for future use
    await supabase.from("epf_integration").upsert({
      user_id: userId,
      epf_number: epfResult.accountNumber,
      account_1_balance: epfResult.account1Balance,
      account_2_balance: epfResult.account2Balance,
      last_contribution: JSON.stringify(epfResult.lastContribution),
      withdrawal_eligibility: JSON.stringify(epfResult.withdrawalEligibility),
      last_updated: new Date().toISOString(),
      access_token: `sim-token-${Date.now()}`,
      refresh_token: `sim-refresh-${Date.now()}`,
      token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    })

    return epfResult
  } catch (error) {
    console.error("EPF data retrieval error:", error)
    return null
  }
}

function isTokenValid(expiryDate: string): boolean {
  if (!expiryDate) return false
  const expiry = new Date(expiryDate).getTime()
  return expiry > Date.now()
}
