"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

export function ProductGallery({
  images,
  alt,
  className = "",
}: ProductGalleryProps) {
  const safeImages =
    images.length > 0 ? images : ["/placeholder.jpg"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images]);

  const mainSrc = safeImages[Math.min(active, safeImages.length - 1)];
  const mainRemote = mainSrc.startsWith("http://") || mainSrc.startsWith("https://");

  return (
    <div className={className}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-stone-100 ring-1 ring-stone-200/80">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          priority
          unoptimized={mainRemote}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {safeImages.length > 1 && (
        <ul
          className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-5"
          role="list"
          aria-label="Product images"
        >
          {safeImages.map((src, index) => {
            const isActive = index === active;
            const thumbRemote = src.startsWith("http://") || src.startsWith("https://");
            return (
              <li key={`${src}-${index}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-16 w-16 overflow-hidden rounded-sm ring-2 transition sm:h-20 sm:w-20 ${
                    isActive
                      ? "ring-stone-900"
                      : "ring-transparent hover:ring-stone-300"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    unoptimized={thumbRemote}
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
