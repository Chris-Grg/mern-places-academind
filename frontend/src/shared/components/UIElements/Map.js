// import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  // const mapRef = useRef();

  // const { center, zoom } = props;

  // useEffect(() => {

  // Requires google map api (add to index.html)

  // const map = new window.google.maps.Map(mapRef.current, {
  //   center: center,
  //   zoom: zoom
  // });

  // new window.google.maps.Marker({ position: center, map: map });
  // }, [center, zoom]);

  return (
    <div
      // ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    >
      {/* Dummy */}
      <h1>MAP</h1>
    </div>
  );
};

export default Map;
