import Image from 'next/image'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

type CoverImageResultProps = {
  src?: string
  alt: string
  photographer: string
  selected: boolean
  onSelect: () => void
}

export function CoverImageResult({
  src,
  alt,
  photographer,
  selected,
  onSelect,
}: CoverImageResultProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Select ${alt || 'cover image'}. Photo by ${photographer}`}
      aria-pressed={selected}
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected && 'ring-2 ring-emerald-300',
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={320}
          height={200}
          className="h-28 w-full object-cover sm:h-32"
        />
      ) : (
        <div className="h-28 w-full bg-muted sm:h-32" />
      )}
      <span className="block px-3 py-2 text-xs text-foreground">
        {photographer}
      </span>
      {selected ? (
        <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-emerald-300 text-black">
          <Check className="size-4" aria-hidden="true" />
        </span>
      ) : null}
    </button>
  )
}
