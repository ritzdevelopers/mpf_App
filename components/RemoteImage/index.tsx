import React, { useState } from "react";
import { Image, ImageProps, ImageStyle, StyleProp } from "react-native";

interface RemoteImageProps extends Omit<ImageProps, "source"> {
  uri?: string | null;
  fallbackUri?: string;
  style?: StyleProp<ImageStyle>;
  className?: string;
}

const DEFAULT_FALLBACK =
  "https://placehold.co/900x600/e2e8f0/94a3b8?text=No+Image";

export default function RemoteImage({
  uri,
  fallbackUri = DEFAULT_FALLBACK,
  ...rest
}: RemoteImageProps) {
  const [errored, setErrored] = useState(false);

  const finalUri = !uri || errored ? fallbackUri : uri;

  return (
    <Image
      {...rest}
      source={{ uri: finalUri }}
      onError={() => setErrored(true)}
    />
  );
}
