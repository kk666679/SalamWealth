"use server"

import { createClient } from "@/lib/supabase/server"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface ZakatInput {
  cash: number
  savings: number
  investments: number
  gold: number
  debts: number
}

export async function calculateAndSaveZakat(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to calculate zakat",
    }
  }

  try {
    const zakatInput: ZakatInput = {
      cash: Number.parseFloat(formData.get("cash") as string) || 0,
      savings: Number.parseFloat(formData.get("savings") as string) || 0,
      investments: Number.parseFloat(formData.get("investments") as string) || 0,
      gold: Number.parseFloat(formData.get("gold") as string) || 0,
      debts: Number.parseFloat(formData.get("debts") as string) || 0,
    }

    const totalWealth =
      zakatInput.cash + zakatInput.savings + zakatInput.investments + zakatInput.gold - zakatInput.debts

    // Current nisab value in RM (would be fetched from an API in production)
    const nisab = 4000

    let zakatAmount = 0
    if (totalWealth >= nisab) {
      zakatAmount = totalWealth * 0.025
    }

    // Save calculation to database
    const supabase = createClient()
    const { error } = await supabase.from("zakat_calculations").insert({
      user_id: session.user.id,
      cash: zakatInput.cash,
      savings: zakatInput.savings,
      investments: zakatInput.investments,
      gold: zakatInput.gold,
      debts: zakatInput.debts,
      total_wealth: totalWealth,
      zakat_amount: zakatAmount,
    })

    if (error) {
      console.error("Error saving zakat calculation:", error)
      return {
        success: false,
        message: "Failed to save calculation",
      }
    }

    revalidatePath("/calculator")

    return {
      success: true,
      totalWealth,
      zakatAmount,
      nisab,
    }
  } catch (error) {
    console.error("Zakat calculation error:", error)
    return {
      success: false,
      message: "An error occurred during calculation",
    }
  }
}

export async function payZakat(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to pay zakat",
    }
  }

  try {
    const zakatId = formData.get("zakatId") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const paymentMethod = formData.get("paymentMethod") as string

    // In production, this would integrate with payment gateways like FPX or DuitNow
    // For this example, we'll simulate a successful payment

    const supabase = createClient()

    // Update zakat calculation status
    await supabase.from("zakat_calculations").update({ payment_status: "paid" }).eq("id", zakatId)

    // Record the transaction
    await supabase.from("transactions").insert({
      user_id: session.user.id,
      transaction_type: "zakat",
      amount,
      description: `Zakat payment via ${paymentMethod}`,
      reference_id: `ZAKAT-${Date.now()}`,
      status: "completed",
    })

    revalidatePath("/calculator")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Zakat payment successful",
      transactionId: `ZAKAT-${Date.now()}`,
    }
  } catch (error) {
    console.error("Zakat payment error:", error)
    return {
      success: false,
      message: "Payment processing failed",
    }
  }
}
