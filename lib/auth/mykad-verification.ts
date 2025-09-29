import { createClient } from "@/lib/supabase/server"

interface VerificationResult {
  verified: boolean
  fullName?: string
  email?: string
  phone?: string
  address?: string
  bumiputeraStatus?: boolean
}

export async function verifyMyKadCredentials(idNumber: string, biometricToken: string): Promise<VerificationResult> {
  try {
    // In a real implementation, this would call the Malaysian government's MyKad API
    // For this example, we'll simulate the verification process

    // Validate MyKad format (12 digits: YYMMDD-PB-###G)
    const myKadRegex = /^\d{6}-\d{2}-\d{4}$/
    if (!myKadRegex.test(idNumber)) {
      return { verified: false }
    }

    // Simulate API call to JPN (Jabatan Pendaftaran Negara)
    const response = await fetch(`${process.env.JPN_API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JPN_API_KEY}`,
      },
      body: JSON.stringify({
        idNumber,
        biometricToken,
      }),
    })

    if (!response.ok) {
      return { verified: false }
    }

    // For demo purposes, we'll simulate a successful verification
    // In production, this would parse the actual JPN response

    // Check if user exists in our cache to reduce API calls
    const supabase = createClient()
    const { data: cachedUser } = await supabase
      .from("mykad_verification_cache")
      .select("*")
      .eq("mykad_id", idNumber)
      .single()

    if (cachedUser) {
      return {
        verified: true,
        fullName: cachedUser.full_name,
        email: cachedUser.email,
        phone: cachedUser.phone,
        address: cachedUser.address,
        bumiputeraStatus: cachedUser.bumiputera_status,
      }
    }

    // Simulate user data from JPN
    const userData = {
      verified: true,
      fullName: "Ahmad bin Abdullah",
      email: "ahmad@example.com",
      phone: "+60123456789",
      address: "123 Jalan Sultan Ismail, Kuala Lumpur",
      bumiputeraStatus: true,
    }

    // Cache the verification result
    await supabase.from("mykad_verification_cache").insert({
      mykad_id: idNumber,
      full_name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      bumiputera_status: userData.bumiputeraStatus,
      verified_at: new Date().toISOString(),
    })

    return userData
  } catch (error) {
    console.error("MyKad verification error:", error)
    return { verified: false }
  }
}
