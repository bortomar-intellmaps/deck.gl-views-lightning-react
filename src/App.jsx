import React, { useCallback, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { BitmapLayer, GeoJsonLayer, PointCloudLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { FirstPersonView, COORDINATE_SYSTEM } from "@deck.gl/core";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Slider } from "primereact/slider";
import { DirectionalLight, LightingEffect, SimpleMeshLayer } from "deck.gl";
import { SphereGeometry } from "@luma.gl/core";

const sphere = new SphereGeometry({
  radius: 25,

  nlat: 360,
  nlong: 360,
});
const INITIAL_VIEW_STATE = {
  latitude: 50.1025731518377,
  longitude: 14.579345887998954,
  pitch: 0,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  maxPitch: 89,
  mainPitch: -89,
  zoom: 1.64214614749443,
  position: [-40, -160, 100],
};

const App = () => {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);
  const [clickCoords, setClickCoords] = useState(500);
  const [views, setViews] = useState(500);
  const [cntrlr, setCntrlr] = useState(true);
  const [x, setX] = useState(50);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(50);
  const deckRef = useRef(null);

  const foo = () => {
    setZ(z + 5);
    // console.log(pc);
    // const tmp = setInitialViewState({
    //   ...initialViewState,
    //   position: [
    //     initialViewState.position[0],
    //     initialViewState.position[1],
    //     initialViewState.position[2] + 100,
    //   ],
    // });
  };
  const renderLayers = () => {
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
      coordinateOrigin: [14.578758657675024, 50.10260379749232],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
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

    const layer = new PointCloudLayer({
      id: "PointCloudLayer",
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
      coordinateOrigin: [14.578758657675024, 50.10260379749232],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      // highlightColor: [0, 0, 128, 128],
      // modelMatrix: null,
      // opacity: 1,
      pickable: true,

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
    const layer2 = new SimpleMeshLayer({
      id: "PointCloudLayer2",
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
      coordinateOrigin: [14.578758657675024, 50.10260379749232],

      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    });

    return [osm, layer, gjsn, layer2];
  };

  const ch = useCallback(({ viewId, viewState }) => {
    // console.log(viewId);
    // console.log(viewState);
    setInitialViewState(viewState);
  }, []);
  const effects = [
    new LightingEffect({
      dir: new DirectionalLight({
        color: [255, 255, 255],
        intensity: 2.0,
        direction: [-1 * (x - 25), -1 * (y - 25), -1 * (z - 25)],
      }),
    }),
  ];
  return (
    <div className="App">
      <DeckGL
        ref={deckRef}
        layers={renderLayers()}
        effects={effects}
        // controller={true}
        onViewStateChange={ch}
        // initialViewState={initialViewState}
        viewState={initialViewState}
        views={[
          new FirstPersonView({
            focalDistance: 100,
            fovy: 80,
            near: 0.1,
            far: 1000,
            controller: cntrlr,
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

        <div>
          <Slider
            onChange={(e) => setY(e.value)}
            value={y}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
