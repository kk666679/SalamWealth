"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, Building2, TrendingUp, Calculator, Phone } from "lucide-react"
import Link from "next/link"
import { LanguageSelector } from "@/components/language-selector"

interface NavigationProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
}

export function Navigation({ selectedLanguage, onLanguageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-emerald-600 text-white p-2 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">SalamWealth</span>
            </Link>
            <Badge className="bg-emerald-100 text-emerald-800 text-xs">BNM Licensed</Badge>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Financing</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="font-medium">Personal Financing</h4>
                        <p className="text-sm text-gray-600">Up to RM100,000</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="font-medium">SME Financing</h4>
                        <p className="text-sm text-gray-600">Business loans up to RM50,000</p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Investment</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">ASB Units</h4>
                        <p className="text-sm text-gray-600">Government-backed investment</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Robo Advisory</h4>
                        <p className="text-sm text-gray-600">Automated halal portfolio</p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/calculator" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <Calculator className="h-4 w-4 mr-2" />
                    Tools
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
            <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard">Get Started</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/financing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    <span>Financing</span>
                  </Link>
                  <Link href="/investment" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Investment</span>
                  </Link>
                  <Link href="/calculator" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <span>Tools</span>
                  </Link>
                  <Link href="/support" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <span>Support</span>
                  </Link>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
