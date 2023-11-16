
// module exports is required to be able to load from gulpfile.
module.exports = {
  default: {
    environment: 'production',
    appTitle: 'Lightning Dashboard',
    appDescription: 'Welcome to Lightning Dashboard.',
    gaTrackingCode: 'UA-170089104-1',
    twitterHandle: '@NASAEarthData',
    map: {
      center: [0, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 20,
    }
  }
};
