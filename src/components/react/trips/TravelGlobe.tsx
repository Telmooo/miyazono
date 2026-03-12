import type { CountryData } from "@/lib/countries";
import type { Trip } from "@/schemas/trips";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";

import geoDatabase from "@/data/trips/ne_110m_admin_0_countries.geojson";
import CountryPanel from "@/components/react/trips/CountryPanel";

interface GeoFeature {
  type: "feature";
  properties: {
    NAME: string;
    ISO_A2: string;
    ISO_A3: string;
    ISO_N3: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface TripWithCountry {
  trip: Trip;
  country: CountryData;
}

export interface CountryTrips {
  country: CountryData;
  trips: Trip[];
  isOrigin: boolean;
}

interface TravelGlobeProps {
  trips: TripWithCountry[];
}

const TravelGlobe = (props: TravelGlobeProps): React.ReactNode => {
  const { trips } = props;
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const geoFeatures = geoDatabase.features as GeoFeature[];
  const [hoveredPolygon, setHoveredPolygon] = useState<GeoFeature | null>(null);
  const [selectedPolygon, setSelectedPolygon] = useState<GeoFeature | null>(
    null,
  );

  // Detect theme
  useEffect(() => {
    const html = document.documentElement;
    setTheme((html.getAttribute("data-theme") as "light" | "dark") || "light");

    const themeChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.theme) {
        setTheme(detail.theme);
      }
    };

    window.addEventListener("themechange", themeChangeHandler);
    return () => window.removeEventListener("themechange", themeChangeHandler);
  }, []);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.min(rect.width, 700),
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Auto-rotate globe
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 500;
    }
  }, []);

  // Group trips by country
  const tripLookup = useMemo(() => {
    const byA2 = new Map<string, CountryTrips>();
    const byA3 = new Map<string, CountryTrips>();
    const byN3 = new Map<string, CountryTrips>();

    for (const { trip, country } of trips) {
      const key = country.cca2;
      const existing = byA2.get(key);
      if (existing) {
        existing.trips.push(trip);
        existing.isOrigin = existing.isOrigin || (trip.isOrigin ?? false);
      } else {
        const entry: CountryTrips = {
          country,
          trips: [trip],
          isOrigin: trip.isOrigin ?? false,
        };
        byA2.set(country.cca2, entry);
        byA3.set(country.cca3, entry);
        byN3.set(country.ccn3, entry);
      }
    }

    return { byA2, byA3, byN3 };
  }, [trips]);

  const findCountryTrips = useCallback(
    (feature: GeoFeature): CountryTrips | undefined => {
      const properties = feature.properties;
      return (
        tripLookup.byA2.get(properties.ISO_A2) ??
        tripLookup.byA3.get(properties.ISO_A3) ??
        tripLookup.byN3.get(properties.ISO_N3)
      );
    },
    [tripLookup],
  );

  const isVisited = useCallback(
    (feature: GeoFeature) => findCountryTrips(feature) !== undefined,
    [findCountryTrips],
  );
  const isOrigin = useCallback(
    (feature: GeoFeature) => findCountryTrips(feature)?.isOrigin === true,
    [findCountryTrips],
  );

  // The active polygon is whichever is hovered, or the selected (pinned) one
  const activePolygon = hoveredPolygon ?? selectedPolygon;

  const polygonCapColour = useCallback(
    (obj: object) => {
      const feature = obj as GeoFeature;
      const visited = isVisited(feature);
      const origin = isOrigin(feature);
      const isActive = activePolygon === feature;

      if (origin && isActive) {
        return theme === "dark"
          ? "rgba(255, 179, 71, 0.95)"
          : "rgba(255, 179, 71, 0.85)";
      }

      if (origin) {
        return theme === "dark"
          ? "rgba(255, 179, 71, 0.7)"
          : "rgba(255, 179, 71, 0.6)";
      }

      if (visited && isActive) {
        return theme === "dark"
          ? "rgba(233, 30, 99, 0.9)"
          : "rgba(233, 30, 99, 0.8)";
      }

      if (visited) {
        return theme === "dark"
          ? "rgba(233, 30, 99, 0.6)"
          : "rgba(233, 30, 99, 0.5)";
      }

      return theme === "dark"
        ? "rgba(100, 100, 120, 0.15)"
        : "rgba(180, 180, 200, 0.3)";
    },
    [activePolygon, isVisited, isOrigin, theme],
  );

  const polygonSideColor = useCallback(
    (obj: object) => {
      const feature = obj as GeoFeature;
      if (isOrigin(feature)) {
        return theme === "dark"
          ? "rgba(255, 179, 71, 0.35)"
          : "rgba(255, 179, 71, 0.25)";
      }
      if (isVisited(feature)) {
        return theme === "dark"
          ? "rgba(233, 30, 99, 0.3)"
          : "rgba(233, 30, 99, 0.2)";
      }
      return "rgba(0, 0, 0, 0.05)";
    },
    [isVisited, isOrigin, theme],
  );

  const polygonAltitude = useCallback(
    (obj: object) => {
      const feature = obj as GeoFeature;
      const isActive = activePolygon === feature;
      if (isActive && isOrigin(feature)) return 0.08;
      if (isOrigin(feature)) return 0.03;
      if (isActive && isVisited(feature)) return 0.06;
      if (isVisited(feature)) return 0.02;
      return 0.005;
    },
    [activePolygon, isVisited, isOrigin],
  );

  const onPolygonHover = useCallback(
    (polygon: object | null) => {
      const feature = polygon as GeoFeature | null;
      if (feature && isVisited(feature)) {
        setHoveredPolygon(feature);
      } else {
        setHoveredPolygon(null);
      }
    },
    [isVisited],
  );

  const onPolygonClick = useCallback(
    (polygon: object | null) => {
      const feature = polygon as GeoFeature | null;
      if (feature && isVisited(feature)) {
        setSelectedPolygon(feature);
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = false;
        }
      } else {
        // Clicked ocean or non-visited country → close panel
        setSelectedPolygon(null);
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
        }
      }
    },
    [isVisited],
  );

  const closePanel = useCallback(() => {
    setSelectedPolygon(null);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
    }
  }, []);

  const selectedCountryTrips = selectedPolygon
    ? (findCountryTrips(selectedPolygon) ?? null)
    : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0, 0, 0, 0)"
        globeImageUrl={
          theme === "dark"
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        showAtmosphere={true}
        atmosphereColor={
          theme === "dark"
            ? "rgba(100, 150, 255, 0.4)"
            : "rgba(70, 130, 230, 0.3)"
        }
        atmosphereAltitude={0.2}
        polygonsData={geoFeatures}
        polygonCapColor={polygonCapColour}
        polygonSideColor={polygonSideColor}
        polygonAltitude={polygonAltitude}
        polygonsTransitionDuration={300}
        polygonStrokeColor={() =>
          theme === "dark"
            ? "rgba(200, 200, 220, 0.15)"
            : "rgba(100, 100, 120, 0.2)"
        }
        onPolygonHover={onPolygonHover}
        onPolygonClick={onPolygonClick}
      />

      <CountryPanel countryTrips={selectedCountryTrips} onClose={closePanel} />
    </div>
  );
};

export default TravelGlobe;
