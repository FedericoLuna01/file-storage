'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { FileIcon, Star } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SideNav () {
  const pathname = usePathname()
  return (
    <div
      className="w-44"
    >
      <nav
        className="flex flex-col gap-4"
      >
        <Link
          href='/dashboard/archivos'
        >
          <Button
            variant='link'
            className={cn("flex gap-2 p-0", {
              'text-blue-500 font-semibold': pathname === '/dashboard/archivos'
            })}
          >
            <FileIcon className="w-5 h-5" />Archivos
          </Button>
        </Link>
        <Link
          href='/dashboard/favoritos'
        >
          <Button
            variant='link'
            className={cn("flex gap-2 p-0", {
              'text-blue-500 font-semibold': pathname === '/dashboard/favoritos'
            })}
          >
            <Star className="w-5 h-5" />Favoritos
          </Button>
        </Link>
      </nav>
    </div>
  )
}