import React, { useState } from "react";
import type { CountryTrips } from "./TravelGlobe";
import type { Trip } from "@/schemas/trips";
import PhotoLightbox from "./PhotoLightbox";

interface CountryPanelProps {
  countryTrips: CountryTrips | null;
  onClose: () => void;
}

const InkDivider = () => (
  <svg
    viewBox="0 0 400 20"
    className="my-4 w-full opacity-30 dark:opacity-20"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M0,10 C30,4 60,16 100,8 C140,0 160,18 200,10 C240,2 280,16 320,8 C360,0 380,14 400,10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrushUnderline = () => (
  <svg
    viewBox="0 0 400 8"
    className="mt-1 h-1 w-full"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,4 C40,1 80,7 120,3 C160,0 200,6 240,4 C280,2 340,7 400,4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-[rgba(233,30,99,0.4)]"
    />
  </svg>
);

const formatPopulation = (population: string | number): string => {
  const num =
    typeof population === "string" ? parseInt(population, 10) : population;
  if (isNaN(num)) return String(population);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};

const formatArea = (area: number): string => area.toLocaleString() + " km²";

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const yearBorderRadius = (year: number): string => {
  const h = hashString(String(year));
  const tl = 38 + (h % 20);
  const tr = 38 + ((h >> 4) % 20);
  const br = 38 + ((h >> 8) % 20);
  const bl = 38 + ((h >> 12) % 20);
  return `${tl}% ${tr}% ${br}% ${bl}%`;
};

interface TripEntryProps {
  trip: Trip;
  countryName: string;
  onPhotoClick: (photos: Trip["photos"], index: number) => void;
}

const TripEntry = ({ trip, countryName, onPhotoClick }: TripEntryProps) => {
  const regionLabel = trip.region ?? countryName;

  return (
    <div>
      <div className="mb-3">
        <h4 className="m-0 font-serif text-lg font-semibold text-(--color-text-primary)">
          {regionLabel}
        </h4>
        <BrushUnderline />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {trip.yearsVisited.map((year) => (
          <span
            key={year}
            className="bg-[rgba(233,30,99,0.12)] px-3 py-1 font-mono text-sm font-semibold text-(--portal-leisure)"
            style={{ borderRadius: yearBorderRadius(year) }}
          >
            {year}
          </span>
        ))}
      </div>

      {trip.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {trip.photos.map((photo, i) => (
            <button
              key={photo.src}
              onClick={() => onPhotoClick(trip.photos, i)}
              className="aspect-video cursor-pointer overflow-hidden rounded-lg border-2 border-transparent p-0 transition-all hover:border-[#e91e63]/50 hover:shadow-md"
              aria-label={`View photo: ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="block h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CountryPanel = ({
  countryTrips,
  onClose,
}: CountryPanelProps): React.ReactNode => {
  const [lightbox, setLightbox] = useState<{
    photos: Trip["photos"];
    index: number;
  } | null>(null);

  if (!countryTrips) return null;

  const { country, trips, isOrigin } = countryTrips;
  const sortedTrips = [...trips].sort(
    (a, b) => (a.yearsVisited[0] ?? 0) - (b.yearsVisited[0] ?? 0),
  );

  const languages = Object.values(country.languages || {}).join(", ");
  const currencies = Object.values(country.currencies || {})
    .map((c) => `${c.name} (${c.symbol})`)
    .join(", ");
  const capital = country.capital?.join(", ") || "N/A";

  const handlePhotoClick = (photos: Trip["photos"], index: number) => {
    setLightbox({ photos, index });
  };

  return (
    <>
      <div
        className="absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden sm:w-96 sm:rounded-l-2xl"
        style={{
          animation:
            "panelSlideIn 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        }}
      >
        <svg
          className="block h-1.5 w-full shrink-0"
          viewBox="0 0 400 8"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,4 C40,1 80,7 120,3 C160,0 200,6 240,4 C280,2 340,7 400,4"
            fill="none"
            stroke="rgba(233, 30, 99, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-1 flex-col overflow-y-auto bg-(--color-bg-secondary)/95 p-6 backdrop-blur-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-(--color-bg-primary)/60 p-0 text-sm text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-primary)"
            aria-label="Close panel"
          >
            ✕
          </button>

          <div className="mb-4 flex items-center gap-3 border-b border-b-gray-500/15 pb-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <div className="flex flex-row items-center gap-2">
                <h3 className="m-0 font-serif text-2xl font-bold text-(--color-text-primary)">
                  {country.name.common}
                </h3>
                {isOrigin && (
                  <span className="rounded-xl bg-[rgba(255,179,71,0.18)] px-3 py-0.5 text-xs font-bold whitespace-nowrap text-[#d4880f] uppercase">
                    Home
                  </span>
                )}
              </div>
              <p className="m-0 mt-0.5 text-sm text-(--color-text-light)">
                {country.name.official}
              </p>
            </div>
          </div>

          {/* Country info grid */}
          <div className="mb-2 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                Capital
              </span>
              <span className="text-sm text-(--color-text-secondary)">
                {capital}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                Region
              </span>
              <span className="text-sm text-(--color-text-secondary)">
                {country.subregion || country.region}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                Population
              </span>
              <span className="text-sm text-(--color-text-secondary)">
                {formatPopulation(country.population)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                Area
              </span>
              <span className="text-sm text-(--color-text-secondary)">
                {formatArea(country.area)}
              </span>
            </div>
            {languages && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                  Languages
                </span>
                <span className="text-sm text-(--color-text-secondary)">
                  {languages}
                </span>
              </div>
            )}
            {currencies && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-(--color-text-light) uppercase">
                  Currency
                </span>
                <span className="text-sm text-(--color-text-secondary) capitalize">
                  {currencies}
                </span>
              </div>
            )}
          </div>

          <InkDivider />

          {/* Trip entries */}
          <div className="space-y-1">
            {sortedTrips.map((trip, i) => (
              <React.Fragment key={trip.id}>
                <TripEntry
                  trip={trip}
                  countryName={country.name.common}
                  onPhotoClick={handlePhotoClick}
                />
                {i < sortedTrips.length - 1 && <InkDivider />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          currentIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) =>
            setLightbox((prev) => (prev ? { ...prev, index } : null))
          }
        />
      )}

      <style>{`
        @keyframes panelSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default CountryPanel;
