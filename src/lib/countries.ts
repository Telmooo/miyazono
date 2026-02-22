const RESTCOUNTRIES_BASE = "https://restcountries.com/v3.1";

export interface CountryData {
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  landlocked: boolean;
  borders: string[];
  area: number;
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: string;
  fifa: string;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  name: {
    common: string;
    official: string;
    nativeName: Record<
      string,
      {
        official: string;
        common: string;
      }
    >;
  };
  currencies: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  languages: Record<string, string>;
  latlng: [number, number];
  demonyms: Record<
    string,
    {
      f: string;
      m: string;
    }
  >;
  translations: Record<
    string,
    {
      official: string;
      common: string;
    }
  >;
  gini: Record<number, number>;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  coatOfArms: {
    png: string;
    svg: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng: [number, number];
  };
  postalCode: {
    format: string;
    regex: string;
  };
}

export async function fetchCountries(codes: string[]): Promise<CountryData[]> {
  if (codes.length === 0) return [];

  const url = `${RESTCOUNTRIES_BASE}/alpha?codes=${codes.join(",")}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch country data: ${response.status} ${response.statusText}`,
    );
  }

  const rawCountryData: CountryData[] = await response.json();
  return rawCountryData;
}
