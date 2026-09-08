import Image from 'next/image'

import { Button } from '@/components/ui/button'

type CoverImagePreviewProps = {
  src: string
  alt: string
  attributionName: string
  attributionUrl: string
  onRemove: () => void
}

export function CoverImagePreview({
  src,
  alt,
  attributionName,
  attributionUrl,
  onRemove,
}: CoverImagePreviewProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Selected cover image</p>
      <div className="overflow-hidden rounded-lg bg-muted">
        <Image
          src={src}
          alt={alt}
          width={700}
          height={400}
          className="h-48 w-full object-cover sm:h-56"
        />
      </div>
      {attributionName && attributionUrl ? (
        <p className="text-sm text-foreground">
          Photo by{' '}
          <a
            href={attributionUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            {attributionName}
          </a>{' '}
          on{' '}
          <a
            href="https://unsplash.com/?utm_source=f4_goal_tracker&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Unsplash
          </a>
          .
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Uploaded image selected.
        </p>
      )}
      <Button type="button" variant="ghost" onClick={onRemove}>
        Remove cover image
      </Button>
    </div>
  )
}
