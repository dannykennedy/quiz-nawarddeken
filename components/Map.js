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

// Options is an array of objects like this:
// {
// latitude:"-12.76378645",
// longitude:"133.844517659562",
// optionCorrect:true,
// title:"Kabulwarnamyo",
// }

export const Map = ({ options, selectedOptionIndex, onSelectOption }) => {
  const [viewport, setViewport] = useState(NT_VIEWPORT);

  const vp = new WebMercatorViewport({
    width: 500,
    height: 500,
  });

  console.log("styles", styles);

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
    console.log("initialBounds", initialBounds);
    return initialBounds;
  }, [bounds, vp]);

  return (
    <div className={styles["map-question-wrapper"]} width={"100%"} height={500}>
      <ReactMapGL
        {...viewport}
        // maxZoom={15}
        latitude={latitude || NT_VIEWPORT.latitude}
        longitude={longitude || NT_VIEWPORT.longitude}
        zoom={zoom || NT_VIEWPORT.zoom}
        getCursor={() => {
          return "grab";
        }}
        style={{ width: 500, height: 500 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_NAWARDDEKEN_MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/lightgarden/clmmvlc0c01yq01rf7j5lddkb"}
        onMove={(viewport) => {
          setViewport(viewport);
        }}
      >
        {options &&
          options.length > 0 &&
          options.map((option, index) => {
            const { latitude, longitude } = option;
            return (
              <Marker
                key={index}
                latitude={latitude}
                longitude={longitude}
                offsetLeft={-20}
                offsetTop={-10}
                onClick={() => {
                  onSelectOption(index);
                }}
              >
                <div className={styles["marker"]}>{indexToLetter(index)}</div>
              </Marker>
            );
          })}
      </ReactMapGL>
      {selectedOptionIndex !== undefined && (
        <div className={styles["map-question-answer"]}>
          <h4>Your Answer: {indexToLetter(selectedOptionIndex)}</h4>
        </div>
      )}
    </div>
  );
};
