// This simulates integration with investment market data providers
// In a real application, this would use actual API calls to these services

interface InvestmentDetails {
  id: string
  name: string
  type: string
  profitRate: number
  halalCertified: boolean
  riskRating: number
  description: string
  minimumInvestment: number
  recommendedTerm: string
  historicalReturns: {
    oneYear: number
    threeYear: number
    fiveYear: number
  }
  certifications: string[]
}

const investmentProducts: Record<string, InvestmentDetails> = {
  asb: {
    id: "asb-001",
    name: "Amanah Saham Bumiputera",
    type: "asb",
    profitRate: 5.5,
    halalCertified: true,
    riskRating: 2,
    description: "Government-backed investment fund for Bumiputera Malaysians",
    minimumInvestment: 10,
    recommendedTerm: "Long-term",
    historicalReturns: {
      oneYear: 5.5,
      threeYear: 5.75,
      fiveYear: 6.0,
    },
    certifications: ["JAKIM Certified", "SC Approved"],
  },
  sukuk: {
    id: "sukuk-gov-001",
    name: "Malaysian Government Sukuk",
    type: "sukuk",
    profitRate: 4.25,
    halalCertified: true,
    riskRating: 1,
    description: "Government-issued Islamic bonds with fixed returns",
    minimumInvestment: 1000,
    recommendedTerm: "3-5 years",
    historicalReturns: {
      oneYear: 4.25,
      threeYear: 4.0,
      fiveYear: 4.15,
    },
    certifications: ["JAKIM Certified", "SC Approved", "BNM Regulated"],
  },
  robo_advisory: {
    id: "robo-001",
    name: "SalamWealth Balanced Portfolio",
    type: "robo_advisory",
    profitRate: 6.8,
    halalCertified: true,
    riskRating: 3,
    description: "AI-managed diversified portfolio of halal investments",
    minimumInvestment: 100,
    recommendedTerm: "3+ years",
    historicalReturns: {
      oneYear: 6.8,
      threeYear: 7.2,
      fiveYear: 7.5,
    },
    certifications: ["JAKIM Certified", "SC Approved", "Shariah Advisory Board Reviewed"],
  },
  gold: {
    id: "gold-001",
    name: "Digital Gold Investment",
    type: "gold",
    profitRate: 3.5,
    halalCertified: true,
    riskRating: 2,
    description: "Physical gold backed digital investment",
    minimumInvestment: 50,
    recommendedTerm: "Long-term",
    historicalReturns: {
      oneYear: 3.5,
      threeYear: 5.2,
      fiveYear: 8.1,
    },
    certifications: ["JAKIM Certified", "SC Approved", "LBMA Certified Gold"],
  },
}

export async function getInvestmentDetails(type: string): Promise<InvestmentDetails> {
  // In production, this would fetch real-time data from market APIs
  // For this example, we'll use our predefined data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = investmentProducts[type]
  if (!product) {
    throw new Error(`Investment type ${type} not found`)
  }

  // Add some randomness to simulate market fluctuations
  const fluctuation = Math.random() * 0.4 - 0.2 // -0.2 to +0.2
  product.profitRate = Number.parseFloat((product.profitRate + fluctuation).toFixed(2))

  return product
}

export async function getAllInvestments(): Promise<InvestmentDetails[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return Object.values(investmentProducts)
}

export async function getMarketTrends() {
  // In production, this would fetch real market trend data
  // For this example, we'll return simulated data

  return {
    shariah_index: {
      current: 1250.75,
      change: 15.25,
      changePercent: 1.23,
    },
    sukuk_yield: {
      current: 4.15,
      change: -0.05,
      changePercent: -1.19,
    },
    gold_price: {
      current: 285.5, // per gram in RM
      change: 2.75,
      changePercent: 0.97,
    },
    top_performers: [
      { name: "Shariah Tech ETF", return: 12.5 },
      { name: "Islamic Healthcare Fund", return: 9.8 },
      { name: "Halal Consumer Goods", return: 7.2 },
    ],
  }
}
