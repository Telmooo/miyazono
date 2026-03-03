import React, { useCallback, useEffect, useRef, useState } from "react";
import type { TripWithCountry } from "./TravelGlobe";

interface TripTooltipProps {
  trip: TripWithCountry | null | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TripTooltip = (props: TripTooltipProps): React.ReactNode => {
  const { trip, onMouseEnter, onMouseLeave } = props;
  const [photoIndex, setPhotoIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photoCount = trip?.trip.photos.length ?? 0;

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (photoCount > 1) {
      autoPlayRef.current = setInterval(() => {
        setPhotoIndex((index) => (index + 1) % photoCount);
      }, 4000);
    }
  }, [photoCount]);

  // Auto-cycle photos
  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetAutoPlay]);

  // Reset index when trip changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [trip?.trip.id]);

  if (!trip) return null;

  const { country, trip: tripData } = trip;

  const languages = Object.values(country.languages || {}).join(", ");
  const currencies = Object.values(country.currencies || {})
    .map((currency) => `${currency.name} (${currency.symbol})`)
    .join(", ");
  const capital = country.capital?.join(", ") || "N/A";
  const photos = tripData.photos;
  const currentPhoto = photos[photoIndex];

  const formatPopulation = (population: string | number) => {
    const populationNumber =
      typeof population === "string" ? parseInt(population, 10) : population;
    if (isNaN(populationNumber)) {
      return String(population);
    }
    if (populationNumber >= 1_000_000_000) {
      return `${(populationNumber / 1_000_000_000).toFixed(1)}B`;
    }
    if (populationNumber >= 1_000_000) {
      return `${(populationNumber / 1_000_000).toFixed(1)}M`;
    }
    if (populationNumber >= 1_000) {
      return `${(populationNumber / 1_000).toFixed(1)}K`;
    }
    return populationNumber.toLocaleString();
  };

  const formatArea = (area: number) => {
    return area.toLocaleString() + " km²";
  };

  const prevPhoto = () => {
    setPhotoIndex((index) => (index - 1 + photos.length) % photos.length);
    resetAutoPlay();
  };

  const nextPhoto = () => {
    setPhotoIndex((index) => (index + 1) % photos.length);
    resetAutoPlay();
  };

  return (
    <div
      className="text-(color-text-primary) absolute top-4 right-4 z-10 max-h-[calc(100%-8)] w-xl animate-[fadeIn] overflow-y-auto rounded-3xl border border-gray-500/20 bg-(--color-bg-secondary) p-6 font-serif shadow-2xl/15 backdrop-blur-md duration-200 ease-out"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-4 flex items-center gap-3 border-b border-b-gray-500/15 p-3">
        <span className="text-5xl">{country.flag} </span>
        <div>
          <div className="flex flex-row items-center gap-2">
            <h3 className="m-0 text-2xl font-bold text-(--color-text-primary)">
              {country.name.common}
            </h3>
            {tripData.isOrigin && (
              <span className="rounded-xl bg-[rgba(255,179,71,0.18)] px-4 py-0.5 font-bold whitespace-nowrap text-[#d4880f] uppercase">
                Home
              </span>
            )}
          </div>
          <p className="m-0 mt-0.5 text-lg text-(--color-text-light)">
            {country.name.official}
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-(--color-text-light) uppercase">
            Capital
          </span>
          <span className="text-sm text-(--color-text-secondary)">
            {capital}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-(--color-text-light) uppercase">
            Region
          </span>
          <span className="text-sm text-(--color-text-secondary)">
            {country.subregion || country.region}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-(--color-text-light) uppercase">
            Population
          </span>
          <span className="text-sm text-(--color-text-secondary)">
            {formatPopulation(country.population)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-(--color-text-light) uppercase">
            Area
          </span>
          <span className="text-sm text-(--color-text-secondary)">
            {formatArea(country.area)}
          </span>
        </div>
        {languages && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-(--color-text-light) uppercase">
              Languages
            </span>
            <span className="text-sm text-(--color-text-secondary)">
              {languages}
            </span>
          </div>
        )}
        {currencies && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-(--color-text-light) uppercase">
              Currency
            </span>
            <span className="text-sm text-(--color-text-secondary) capitalize">
              {currencies}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 border-t border-gray-500/15 pt-3">
        <span className="text-xs font-semibold text-(--color-text-light) uppercase">
          Visited
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {tripData.yearsVisited.map((year) => (
            <span
              key={year}
              className="rounded-xl bg-[rgba(233,30,99,0.12)] px-3 py-1 font-mono text-sm font-semibold text-(--portal-leisure)"
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {photos.length > 0 && currentPhoto && (
        <div className="pt-3">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              className="block h-full w-full object-cover"
            />

            {photos.length > 1 && (
              <React.Fragment>
                <button
                  onClick={prevPhoto}
                  className="absolute top-1/2 left-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-black/50 p-0 text-xl text-white"
                  aria-label="Previous photo"
                >
                  &lsaquo;
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-black/50 p-0 text-xl text-white"
                  aria-label="Next photo"
                >
                  &rsaquo;
                </button>
              </React.Fragment>
            )}
          </div>

          {currentPhoto.caption && (
            <p className="text-(color-text-light) mt-2 mb-0 text-center text-sm italic">
              {currentPhoto.caption}
            </p>
          )}

          {photos.length > 1 && (
            <div className="mt-2 flex justify-center gap-1">
              {photos.map((_, index) => (
                <span
                  key={index}
                  className="size-1 rounded-full bg-(--portal-leisure)"
                  style={{
                    opacity: index === photoIndex ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripTooltip;
