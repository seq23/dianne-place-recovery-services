import mediaManifest from '@/data/media/site_images.json';

type SiteImageProps = {
  slotId: string;
  className?: string;
};

type MediaSlot = {
  id: string;
  placement: string;
  assetPath: string;
  alt: string;
  direction: string;
};

export function SiteImage({ slotId, className = '' }: SiteImageProps) {
  const slot = (mediaManifest.slots as MediaSlot[]).find((item) => item.id === slotId);

  if (!slot) {
    return (
      <div className={`site-image-fallback ${className}`} role="img" aria-label="Image slot missing">
        Image slot missing
      </div>
    );
  }

  if (slot.assetPath) {
    return (
      // Native img keeps the repo static-export friendly and avoids remote image config drift.
      <img className={`site-image ${className}`} src={slot.assetPath} alt={slot.alt} loading="lazy" />
    );
  }

  return (
    <div className={`site-image-fallback ${className}`} role="img" aria-label={slot.alt}>
      <span>{slot.placement}</span>
      <small>{slot.direction}</small>
    </div>
  );
}
