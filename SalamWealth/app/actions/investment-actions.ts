"use server"

import { createClient } from "@/lib/supabase/server"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { getInvestmentDetails } from "@/lib/investment/market-data"

export async function createInvestment(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to make investments",
    }
  }

  try {
    const investmentType = formData.get("investmentType") as string
    const amount = Number.parseFloat(formData.get("amount") as string)

    // Validate input
    if (!investmentType || !amount) {
      return {
        success: false,
        message: "All required fields must be provided",
      }
    }

    // Check minimum investment amounts
    const minimums = {
      asb: 10,
      sukuk: 1000,
      robo_advisory: 100,
      gold: 50,
    }

    if (amount < minimums[investmentType as keyof typeof minimums]) {
      return {
        success: false,
        message: `Minimum investment for ${investmentType} is RM${minimums[investmentType as keyof typeof minimums]}`,
      }
    }

    // Get investment details (rates, risk, etc.)
    const investmentDetails = await getInvestmentDetails(investmentType)

    // Process payment (in production, this would integrate with payment gateways)
    // For this example, we'll simulate a successful payment

    // Save investment to database
    const supabase = createClient()
    const { data, error } = await supabase
      .from("investment_accounts")
      .insert({
        user_id: session.user.id,
        investment_type: investmentType,
        amount,
        current_value: amount, // Initially the same as amount
        profit_rate: investmentDetails.profitRate,
        halal_certified: investmentDetails.halalCertified,
        risk_rating: investmentDetails.riskRating,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating investment:", error)
      return {
        success: false,
        message: "Failed to process investment",
      }
    }

    // Record the transaction
    await supabase.from("transactions").insert({
      user_id: session.user.id,
      transaction_type: "investment",
      amount,
      description: `Investment in ${investmentDetails.name}`,
      reference_id: `INV-${Date.now()}`,
      status: "completed",
    })

    revalidatePath("/investment")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Investment processed successfully",
      investmentId: data.id,
      details: investmentDetails,
    }
  } catch (error) {
    console.error("Investment processing error:", error)
    return {
      success: false,
      message: "An error occurred during investment processing",
    }
  }
}
