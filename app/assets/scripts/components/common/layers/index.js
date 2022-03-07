import defaultsDeep from 'lodash.defaultsdeep';

const layerOverrides = [
];

// Store the layer data.
const layersDataBySpotlight = {};

// export function getSpotlightLayers (spotlightId) {
//   return layersDataBySpotlight[spotlightId];
// }

export function getGlobalLayers () {
  return layersDataBySpotlight.global;
}

export const storeSpotlightLayers = (spotlightId, layers) => {
  // Overrides to the layer settings.
  const spotLayers = layers
    .map((layer) => {
      const base = layerOverrides.find(l => l.id === layer.id) || {};

      // The local changes are the default, and are replaced by new properties
      // that come from the api. The local updates will always take precedence.
      return defaultsDeep({}, base, layer);
    });

  layersDataBySpotlight[spotlightId] = spotLayers;
};
