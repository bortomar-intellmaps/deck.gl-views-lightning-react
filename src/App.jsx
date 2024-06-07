import React, { useCallback, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { BitmapLayer, GeoJsonLayer, PointCloudLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { FirstPersonView, COORDINATE_SYSTEM, MapView } from "@deck.gl/core";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import {
  DirectionalLight,
  LightingEffect,
  OrbitView,
  SimpleMeshLayer,
} from "deck.gl";
import { SphereGeometry } from "@luma.gl/core";

const sphere = new SphereGeometry({
  radius: 25,

  nlat: 360,
  nlong: 360,
});
const INITIAL_VIEW_STATE = {
  latitude: 50.1025731518377,
  longitude: 14.579345887998954,
  bearing: 0,
  // minZoom: 2,
  // maxZoom: 30,
  zoom: -1,
  maxPitch: 89,
  mainPitch: -89,
  pitch: 0,
  rotationX: 45,
  position: [25, -60, 50],
  target: [25, 25, 20],
};

const App = () => {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const [cntrlr, setCntrlr] = useState(true);
  const [x, setX] = useState(50);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(50);
  const deckRef = useRef(null);

  const renderLayers = () => {
    const gjsnPoint = new GeoJsonLayer({
      id: "gjsn-point",
      // data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-10, -10, 20],
            },
          },
        ],
      },
      coordinateOrigin: [14.579345887998954, 50.1025731518377],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      pointBillboard: true,
      filled: true,
      pointRadiusUnits: "pixels",
      pointRadiusScale: 10,
      // pointAntialiasing: true,
      pointType: "circle",
      getRadius: 5,
      getFillColor: [0, 255, 0, 255],
    });

    const gjsn = new GeoJsonLayer({
      id: "gjsn",
      // data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [0, 0],
                  [0, 50],
                  [50, 50],
                  [50, 0],
                  [0, 0],
                  // [ 14.578659642397554, 50.102875981837855 ],
                  // [ 14.578758657675024, 50.10260379749232 ],
                  // [ 14.579932695964771, 50.102758035478246 ],
                  // [ 14.579734665409887,  50.10299392790756 ],
                  // [ 14.578659642397554, 50.102875981837855 ]
                ],
              ],
            },
          },
        ],
      },
      coordinateOrigin: [0, 0, 0],
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      extruded: true,
      getElevation: 50,
      // material: false,
      filled: false,
      // stroked: true,
      // getFillColor: [0, 255, 0, 255],
      // getLineColor: [0,0,0],
      // getLineWidth: 5,
      wireframe: true,
    });

    const osm = new TileLayer({
      id: "openstreet",
      data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maxZoom: 19,
      minZoom: 0,
      renderSubLayers: (props) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile;

        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        });
      },
    });

    const pcl = new PointCloudLayer({
      id: "pcl",
      // data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json',
      data: [
        {
          position: [x, y, z],
          // normal: [1, 1, 0],
          color: [0, 0, 255],
        },
      ],
      getColor: (d) => d.color,
      // getNormal: (d) => d.normal,
      getPosition: (d) => d.position,
      // material: true,
      pointSize: 5,
      // sizeUnits: 'pixels',
      /* props inherited from Layer class */
      // autoHighlight: false,
      coordinateOrigin: [0, 0, 0],
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      // highlightColor: [0, 0, 128, 128],
      // modelMatrix: null,
      // opacity: 1,
      // pickable: true,

      // onDragStart(info) {
      //   setCntrlr(false);
      // },
      // onDrag(info, event) {
      //   console.log(info);
      //   console.log(event);
      //   if (x < 50) setX(x + 1);
      // },
      // onDragEnd(info) {
      //   setCntrlr(true);
      // },
      // visible: true,
      // wrapLongitude: false,
      // material: {
      //   ambient: 0.5,
      //   shininess: 10,
      //   diffuse: 0.5,
      // },
    });
    const sml = new SimpleMeshLayer({
      id: "sml",
      // data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json',
      data: [
        {
          position: [25, 25, 25],
        },
      ],
      mesh: sphere,
      material: {
        ambient: 0.5,
        shininess: 10,
        diffuse: 0.5,
      },
      opacity: 1,
      getColor: [25, 255, 150],
      getPosition: (d) => d.position,
      coordinateOrigin: [14.579345887998954, 50.1025731518377],

      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    });

    return [osm, pcl, gjsn, gjsnPoint, sml];
  };

  const effects = [
    new LightingEffect({
      dir: new DirectionalLight({
        color: [255, 255, 255],
        intensity: 2.0,
        direction: [-1 * (x - 25), -1 * (y - 25), -1 * (z - 25)],
      }),
    }),
  ];

  const layerFiler = useCallback(({ layer, viewport }) => {
    if (
      viewport.id === "mini-map" &&
      ["openstreet", "sml", "gjsn-point"].includes(layer.id)
    )
      return false;
    if (viewport.id === "FirstPersonView" && ["gjsn", "pcl"].includes(layer.id))
      return false;
    return true;
  });

  const [viewState, setViewState] = useState({
    fpv: {
      latitude: 50.1025731518377,
      longitude: 14.579345887998954,
      bearing: 0,
      maxPitch: 89,
      mainPitch: -89,
      pitch: 0,
      position: [25, -60, 50],
    },
    "mini-map": {
      // minZoom: 2,
      // maxZoom: 30,
      zoom: 0,
      maxPitch: 89,
      mainPitch: -89,
      rotationX: 0,
      rotationOrbit: 0,
      target: [25, 25, 20],
    },
  });

  const onViewStateChange = useCallback(({ viewId, viewState }) => {
    setViewState((current) => {
      if (viewState.bearing != undefined) {
        current["mini-map"].rotationOrbit = viewState.bearing;
        current["mini-map"].rotationX = viewState.pitch;
      }
      if (viewState.rotationX != undefined) {
        current["fpv"].bearing = viewState.rotationOrbit;
        current["fpv"].pitch = viewState.rotationX;
      }

      return {
        ...current,
        [viewId]: viewState,
      };
    });
  }, []);

  const onViewStateChangeNonCache = (data) => {
    setViewState({
      ...viewState,
      [data.viewId]: data.viewState,
    });
  };
  // ======================================

  const getState = useCallback((id) => {
    console.log(deckRef.current.deck);
    console.log(deckRef.current.deck.viewManager.getViewState("fpv"));
  });

  return (
    <div className="App">
      <DeckGL
        ref={deckRef}
        effects={effects}
        layers={renderLayers()}
        layerFilter={layerFiler}
        // controller={true}
        // initialViewState={viewState}
        onViewStateChange={onViewStateChange}
        viewState={viewState}
        views={[
          new FirstPersonView({
            id: "fpv",
            focalDistance: 100,
            fovy: 80,
            near: 0.1,
            far: 1000,
            controller: cntrlr,
          }),
          new OrbitView({
            id: "mini-map",
            x: "70%",
            y: "70%",
            height: "25%",
            width: "25%",
            clear: true,
            controller: { doubleClickZoom: false, scrollZoom: false },
          }),
        ]}
      />
      <div
        className="absolute p-3 top-0 flex flex-column justify-content-between "
        style={{
          width: "300px",
          height: "100px",
        }}
      >
        <Slider
          onChange={(e) => setZ(e.value)}
          value={z}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />

        <Slider
          onChange={(e) => setX(e.value)}
          value={x}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />

        <Slider
          onChange={(e) => setY(e.value)}
          value={y}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
        {/* <Button onClick={(e) => getState("test")} label="state" /> */}
      </div>
    </div>
  );
};

export default App;
