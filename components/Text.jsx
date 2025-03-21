'use client'
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'



export default function Text() {

  const handleClick = (mode) => {
    mode ? toast.success('text success') : toast.error('test error')
  }

  return (
    <div>
        <Button 
        className="bg-amber-500" 
        size="lg" 
        varient="outline" 
        onClick={() => handleClick(true) } >Demo</Button>
    </div>
  )
}
