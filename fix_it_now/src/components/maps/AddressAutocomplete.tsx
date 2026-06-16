import { useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export type SelectedPlace = { address: string; lat?: number; lng?: number };

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPlace?: (place: SelectedPlace) => void;
  placeholder?: string;
  className?: string;
};

/**
 * Address input backed by Google Places Autocomplete. Gracefully degrades to a
 * plain input when VITE_GOOGLE_MAPS_API_KEY is not set, so the form always works.
 * Restricted to Sri Lanka (country "lk").
 */
function AutocompleteInput({ value, onChange, onPlace, placeholder, className }: Props) {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const ac = new places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry"],
      componentRestrictions: { country: ["lk"] },
    });
    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const address = place.formatted_address ?? inputRef.current?.value ?? "";
      onChange(address);
      onPlace?.({
        address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      });
    });
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

export function AddressAutocomplete(props: Props) {
  if (!MAPS_KEY) {
    return (
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className={props.className}
      />
    );
  }
  return (
    <APIProvider apiKey={MAPS_KEY}>
      <AutocompleteInput {...props} />
    </APIProvider>
  );
}
