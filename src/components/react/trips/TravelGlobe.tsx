import type { CountryData } from "@/lib/countries";
import type { Trip } from "@/schemas/trips";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";

import geoDatabase from "@/data/trips/ne_110m_admin_0_countries.geojson";
import TripTooltip from "@/components/react/trips/TripTooltip";

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

interface TravelGlobeProps {
  trips: TripWithCountry[];
}

const TravelGlobe = (props: TravelGlobeProps): React.ReactNode => {
  const { trips } = props;
  console.log(trips);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const geoFeatures = geoDatabase.features as GeoFeature[];
  const [hoveredPolygon, setHoveredPolygon] = useState<GeoFeature | null>(null);
  const tooltipHoveredRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const tripLookup = useMemo(() => {
    const byA2 = new Map<string, TripWithCountry>();
    const byA3 = new Map<string, TripWithCountry>();
    const byN3 = new Map<string, TripWithCountry>();

    for (const trip of trips) {
      byA2.set(trip.country.cca2, trip);
      byA3.set(trip.country.cca3, trip);
      byN3.set(trip.country.ccn3, trip);
    }

    return { byA2, byA3, byN3 };
  }, [trips]);

  const findTrip = useCallback(
    (feature: GeoFeature): TripWithCountry | undefined => {
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
    (feature: GeoFeature) => findTrip(feature) !== undefined,
    [findTrip],
  );
  const isOrigin = useCallback(
    (feature: GeoFeature) => findTrip(feature)?.trip.isOrigin === true,
    [findTrip],
  );

  const polygonCapColour = useCallback(
    (obj: object) => {
      const feature = obj as GeoFeature;
      const visited = isVisited(feature);
      const origin = isOrigin(feature);
      const isHovered = hoveredPolygon === feature;

      if (origin && isHovered) {
        return theme === "dark"
          ? "rgba(255, 179, 71, 0.95)"
          : "rgba(255, 179, 71, 0.85)";
      }

      if (origin) {
        return theme === "dark"
          ? "rgba(255, 179, 71, 0.7)"
          : "rgba(255, 179, 71, 0.6)";
      }

      if (visited && isHovered) {
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
    [hoveredPolygon, isVisited, isOrigin, theme],
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
      if (hoveredPolygon === feature && isOrigin(feature)) return 0.08;
      if (isOrigin(feature)) return 0.03;
      if (hoveredPolygon === feature && isVisited(feature)) return 0.06;
      if (isVisited(feature)) return 0.02;
      return 0.005;
    },
    [hoveredPolygon, isVisited, isOrigin],
  );

  const dismissTooltip = useCallback(() => {
    setHoveredPolygon(null);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
    }
  }, []);

  const scheduleDismiss = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }

    dismissTimerRef.current = setTimeout(() => {
      if (!tooltipHoveredRef.current) {
        dismissTooltip();
      }
    }, 300);
  }, [dismissTooltip]);

  const cancelDismiss = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const onPolygonHover = useCallback(
    (polygon: object | null) => {
      const feature = polygon as GeoFeature | null;

      if (feature && isVisited(feature)) {
        cancelDismiss();
        setHoveredPolygon(feature);
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = false;
        }
      } else {
        scheduleDismiss();
      }
    },
    [isVisited, cancelDismiss, scheduleDismiss],
  );

  const onTooltipMouseEnter = useCallback(() => {
    tooltipHoveredRef.current = true;
    cancelDismiss();
  }, [cancelDismiss]);

  const onTooltipMouseLeave = useCallback(() => {
    tooltipHoveredRef.current = false;
    scheduleDismiss();
  }, [scheduleDismiss]);

  const hoveredTrip = hoveredPolygon ? findTrip(hoveredPolygon) : null;

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
      />

      <TripTooltip
        trip={hoveredTrip}
        onMouseEnter={onTooltipMouseEnter}
        onMouseLeave={onTooltipMouseLeave}
      />
    </div>
  );
};

export default TravelGlobe;
