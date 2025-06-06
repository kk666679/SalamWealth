"use server"

import { createClient } from "@/lib/supabase/server"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { checkCreditScore } from "@/lib/credit/ctos-integration"

export async function submitFinancingApplication(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to apply for financing",
    }
  }

  try {
    const financingType = formData.get("financingType") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const termMonths = Number.parseInt(formData.get("termMonths") as string)
    const profitRate = Number.parseFloat(formData.get("profitRate") as string)
    const purpose = formData.get("purpose") as string
    const shariahContractType = formData.get("shariahContractType") as string
    const takafulIncluded = formData.get("takafulIncluded") === "true"

    // Validate input
    if (!financingType || !amount || !termMonths || !profitRate || !shariahContractType) {
      return {
        success: false,
        message: "All required fields must be provided",
      }
    }

    // Check financing limits based on type
    const limits = {
      personal: 100000,
      sme: 50000,
      education: 75000,
    }

    if (amount > limits[financingType as keyof typeof limits]) {
      return {
        success: false,
        message: `Maximum financing amount for ${financingType} is RM${limits[financingType as keyof typeof limits]}`,
      }
    }

    // Check credit score with CTOS/CCRIS
    const creditCheck = await checkCreditScore(session.user.myKadId)

    if (creditCheck.score < 650) {
      return {
        success: false,
        message: "We're unable to approve your application at this time due to credit score requirements",
        creditScore: creditCheck.score,
      }
    }

    // Calculate monthly payment
    const monthlyRate = profitRate / 100 / 12
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)

    // Save application to database
    const supabase = createClient()
    const { data, error } = await supabase
      .from("financing_applications")
      .insert({
        user_id: session.user.id,
        financing_type: financingType,
        amount,
        term_months: termMonths,
        profit_rate: profitRate,
        purpose,
        monthly_payment: monthlyPayment,
        takaful_included: takafulIncluded,
        shariah_contract_type: shariahContractType,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving financing application:", error)
      return {
        success: false,
        message: "Failed to submit application",
      }
    }

    // In a real application, this would trigger notifications, emails, etc.

    revalidatePath("/financing")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Financing application submitted successfully",
      applicationId: data.id,
      monthlyPayment,
    }
  } catch (error) {
    console.error("Financing application error:", error)
    return {
      success: false,
      message: "An error occurred during application submission",
    }
  }
}
