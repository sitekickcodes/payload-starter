import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Image source URL or static import */
  src: string | StaticImageData;
  /** Image alt text */
  alt?: string;
  /** Hero height variant */
  size?: "tall" | "medium" | "short";
  /** Priority loading for LCP images */
  priority?: boolean;
  /** Content rendered over the image (positioned at bottom) */
  children?: React.ReactNode;
  /** Additional class names on the outer section */
  className?: string;
  /** Use blurred poster style (for detail pages) */
  posterStyle?: boolean;
  /** Image placeholder for static imports */
  placeholder?: "blur" | "empty";
  /** Blur data URL for placeholder */
  blurDataURL?: string;
  /** CSS object-position for the cover image (e.g. "center 20%") */
  objectPosition?: string;
}

const sizeClasses = {
  tall: "h-[36rem] sm:h-[32rem] md:h-[36rem] lg:h-[44rem]",
  medium: "min-h-56 sm:min-h-0 sm:aspect-[5/2] lg:aspect-[3/1]",
  short: "",
};

const gradientClasses = {
  tall: "bg-gradient-to-t from-background via-background/70 via-35% to-transparent",
  medium: "bg-gradient-to-t from-background via-background/60 via-35% to-background/20",
  short: "bg-gradient-to-t from-background via-background/70 via-45% to-background/30",
};

export function PageHero({
  src,
  alt = "",
  size = "medium",
  priority = true,
  children,
  className,
  posterStyle,
  placeholder,
  blurDataURL,
  objectPosition,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      {posterStyle ? (
        <>
          <div className="absolute -inset-10" aria-hidden="true">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover blur-2xl saturate-150 brightness-75"
              priority={priority}
              sizes="100vw"
            />
          </div>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain drop-shadow-2xl"
            priority={priority}
            sizes="100vw"
          />
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover hero-image-reveal"
          style={objectPosition ? { objectPosition } : undefined}
          priority={priority}
          quality={60}
          sizes="100vw"
          {...(placeholder ? { placeholder } : {})}
          {...(blurDataURL ? { blurDataURL } : {})}
        />
      )}

      {/* Gradient overlay — skip for poster style (blur backdrop is sufficient) */}
      {!posterStyle && (
        <div className={cn("absolute inset-0", gradientClasses[size])} />
      )}

      {/* Content */}
      {children && (
        <div className={cn("container relative flex h-full min-h-[inherit] items-end pb-8 pt-24 md:pb-10 lg:pb-14", size === "short" && "pt-32 md:pt-36")}>
          {children}
        </div>
      )}
    </section>
  );
}
