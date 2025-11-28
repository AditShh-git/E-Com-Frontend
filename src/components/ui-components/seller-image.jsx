"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { file_img_url } from "@/constants/backend-urls"

export default function SellerImage({ imageId, alt, className = "", width = 40, height = 40 }) {
  const [imageData, setImageData] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!imageId) {
      setImageData("/placeholder.svg")
      setLoading(false)
      return
    }

    let objectUrl = ""
    const loadImage = async () => {
      try {
        const response = await fetch(file_img_url(imageId))
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setImageData(url)
      } catch (error) {
        console.error('Error loading image:', error)
        setImageData("/placeholder.svg")
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    // Cleanup function to revoke object URL when component unmounts or imageId changes
    return () => {
      if (imageData && imageData.startsWith('blob:')) {
        URL.revokeObjectURL(imageData)
      }
    }
  }, [imageId])

  if (loading) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} style={{ width, height }} />
  }

  return (
    <img
      src={imageData}
      alt={alt}
      className={className}
      style={{ width, height, objectFit: "cover" }}
    />
  )
}
