import React, { useState, useMemo } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { WebMercatorViewport } from "@deck.gl/core";
import { indexToLetter } from "../util/string";
import styles from "../styles/Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

const NT_VIEWPORT = {
  latitude: -18.67,
  longitude: 133.77,
  zoom: 4.61,
};

console.log(
  "NEXT_PUBLIC_NAWARDDEKEN_MAPBOX_TOKENzz",
  process.env.NEXT_PUBLIC_NAWARDDEKEN_MAPBOX_TOKEN
);

export const MatchingMap = ({ options }) => {
  console.log("options", options);

  const mapDiameter = 400;

  const [viewport, setViewport] = useState(NT_VIEWPORT);

  const vp = new WebMercatorViewport({
    width: mapDiameter,
    height: mapDiameter,
  });

  // Get minLng, minLat, maxLng, maxLat from options
  const bounds = useMemo(() => {
    if (!options || options.length === 0) return null;
    const minLng = Math.min(...options.map((o) => o.longitude));
    const minLat = Math.min(...options.map((o) => o.latitude));
    const maxLng = Math.max(...options.map((o) => o.longitude));
    const maxLat = Math.max(...options.map((o) => o.latitude));
    return [
      [minLng, minLat],
      [maxLng, maxLat],
    ];
  }, [options]);

  // Create initial viewport to fit bounds
  const { longitude, latitude, zoom } = useMemo(() => {
    if (!bounds) return NT_VIEWPORT;
    const initialBounds = vp.fitBounds(bounds, {
      padding: 50,
    });
    return initialBounds;
  }, [bounds, vp]);

  return (
    <div
      className={`${styles["map-question-wrapper"]} ${styles["matching-map__map"]}`}
      width={"100%"}
      height={mapDiameter}
    >
      <ReactMapGL
        {...viewport}
        // maxZoom={15}
        latitude={latitude || NT_VIEWPORT.latitude}
        longitude={longitude || NT_VIEWPORT.longitude}
        zoom={zoom || NT_VIEWPORT.zoom}
        getCursor={() => {
          return "grab";
        }}
        style={{ width: mapDiameter, height: mapDiameter }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_NAWARDDEKEN_MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/lightgarden/clmmvlc0c01yq01rf7j5lddkb"}
        onMove={(viewport) => {
          setViewport(viewport);
        }}
      >
        {options &&
          options.length > 0 &&
          options.map((option, index) => {
            const { latitude, longitude, title: optionTitle } = option;
            console.log("option", option);
            return (
              <Marker
                key={index}
                latitude={latitude}
                longitude={longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div className={styles["marker"]}>{optionTitle}</div>
              </Marker>
            );
          })}
      </ReactMapGL>
    </div>
  );
};
