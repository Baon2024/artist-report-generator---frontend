"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    console.log("Input value:", inputValue)
  }

  return (
    (<div
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Basic UI Components</h1>
      {/* Input Section */}
      <div className="space-y-2">
        <Label htmlFor="text-input" className="text-sm font-medium text-gray-700">
          Enter some text
        </Label>
        <Input
          id="text-input"
          type="text"
          placeholder="Type something here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full" />
      </div>
      {/* Button Variants */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Button Variants</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleSubmit} className="w-full">
            Primary
          </Button>
          
          <Button variant="secondary" onClick={handleSubmit} className="w-full">
            Secondary
          </Button>
          
          <Button variant="outline" onClick={handleSubmit} className="w-full">
            Outline
          </Button>
          
          <Button variant="ghost" onClick={handleSubmit} className="w-full">
            Ghost
          </Button>
        </div>

        <Button variant="destructive" onClick={handleSubmit} className="w-full">
          Destructive
        </Button>
      </div>
      {/* Input Types */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Input Types</h2>
        
        <div className="space-y-2">
          <Label htmlFor="email-input">Email</Label>
          <Input id="email-input" type="email" placeholder="your@email.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-input">Password</Label>
          <Input id="password-input" type="password" placeholder="Enter password" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number-input">Number</Label>
          <Input id="number-input" type="number" placeholder="123" />
        </div>
      </div>
      {/* Interactive Example */}
      <div className="pt-4 border-t">
        <div className="flex gap-2 max-w-md mx-auto mt-10">
          <Input
            placeholder="Quick action input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1" />
          <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
            Submit
          </Button>
        </div>
      </div>
    </div>)
  );
}
