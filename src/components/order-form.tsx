import { useState } from "'react'"
import { Button } from "'@/components/ui/button'"
import { Input } from "'@/components/ui/input'"
import { Label } from "'@/components/ui/label'"

export function OrderForm() {
  const [address, setAddress] = useState("''")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the order to your backend
    console.log("'Order submitted with address:'", address)
    alert("'Order submitted successfully!'")
    setAddress("''")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address">Delivery Address</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
          required
        />
      </div>
      <Button type="submit">Place Order</Button>
    </form>
  )
}

