import Link from "'next/link'"
import { Button } from "'@/components/ui/button'"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-stone-900 dark:text-stone-50">FoodDelivery</Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50">Home</Link>
          <Link href="/restaurants" className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50">Restaurants</Link>
          <Link href="/my-orders" className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50">My Orders</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50">Contact Us</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

