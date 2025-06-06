import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, this would fetch live data from PNB or market data providers
    // For this example, we'll return simulated real-time data

    const marketData = {
      currentPrice: 1.0, // ASB is always RM1.00 per unit
      dividend: 5.5, // Current dividend rate
      totalUnits: 12500000000, // Total units available
      availableUnits: 2500000000, // Available for purchase
      lastDividend: "2023",
      nextDividend: "2024",
      performance: {
        oneYear: 5.5,
        threeYear: 5.75,
        fiveYear: 6.0,
        tenYear: 6.25,
      },
      fundSize: 125000000000, // RM125 billion
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(marketData)
  } catch (error) {
    console.error("ASB market data API error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
