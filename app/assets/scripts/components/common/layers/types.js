// need this for any date changes or tiles/layer changes

import { format, sub } from 'date-fns';
import bbox from '@turf/bbox';

const dateFormats = {
  monthOnly: 'MM',
  month: 'yyyyMM',
  day: 'yyyy_MM_dd'
};

const prepDateSource = (source, date, timeUnit = 'month') => {
  //console.log("hello world im in {date} fomat at types.js", format(date, dateFormats[timeUnit]))
  return {
    ...source,
    tiles: source.tiles.map((t) =>
      t.replace('{date}', format(date, dateFormats[timeUnit]))
    )
  };
};

const prepDateSource_nonRegular = (source, date) =>{
  return{
    ...source,
    tiles:source.tiles.map((t)=> t.replace('{date}', date))
  };
}

const prepTimeSource_nonRegular = (source, time) =>{
  return{
    ...source,
    tiles:source.tiles.map((t)=> t.replace('{time}', time))
  };
}

const prepGammaSource = (source, knobPos) => {
  // Gamma is calculated with the following scale:
  // domain: 0-100  range: 2-0.1
  // The higher the Knob, the lower the gamma.
  // This is a linear scale of type y = -mx + b
  // y = -0.02x + 2;

  return {
    ...source,
    tiles: source.tiles.map((t) => t.replace('{gamma}', -0.019 * knobPos + 2))
  };
};

const prepSource = (layerInfo, source, date, knobPos, ctx) => {

  console.log('im in layers/types -- prepsource')
  console.log(ctx)
  if(layerInfo.timeline_type === 'non-regular' && ctx){
    source = prepDateSource_nonRegular(source, `${ctx.props.time.year}${ctx.props.time.month}${ctx.props.time.day}`)
    source = prepTimeSource_nonRegular(source, `${ctx.props.time.time}`)
    return source;
  }
  if (layerInfo.legend.type === 'gradient-adjustable') {
    source = prepGammaSource(source, knobPos);
  }
  source = prepDateSource(source, date, layerInfo.timeUnit);
  return source;
};

export const replaceRasterTiles = (theMap, sourceId, tiles) => {
  // https://github.com/mapbox/mapbox-gl-js/issues/2941
  // Set the tile url to a cache-busting url (to circumvent browser caching behaviour):
  theMap.getSource(sourceId).tiles = tiles;
  // Remove the tiles for a particular source
  theMap.style.sourceCaches[sourceId].clearTiles();
  // Load the new tiles for the current viewport (theMap.transform -> viewport)
  theMap.style.sourceCaches[sourceId].update(theMap.transform);
  // Force a repaint, so that the map will be repainted without you having to touch the map
  theMap.triggerRepaint();
};

export const layerTypes = {
  'raster-timeseries': {
    update: (ctx, layerInfo, prevProps, comparingLayer, prevComparingId) => {
      const { mbMap, mbMapComparing, mbMapComparingLoaded, props } = ctx;
      const { id, source, compare, paint } = layerInfo;
      const prevLayerInfo = prevProps.layers.find((l) => l.id === layerInfo.id);
      const { date, comparing } = props;

      const knobPos = layerInfo.knobCurrPos;
      const knobPosPrev = prevLayerInfo ? prevLayerInfo.knobCurrPos : null;

      if(layerInfo.timeline_type === 'non-regular'){

        if(prevProps.time && ctx){
          if((prevProps.time.year === ctx.props.time.year) &&
          (prevProps.time.month === ctx.props.time.month) &&
          (prevProps.time.day === ctx.props.time.day) &&
          (prevProps.time.time === ctx.props.time.time)) return;
        }

        if(ctx && ctx.props && ctx.props.time){
          console.log(ctx)
          console.log("here in update")
          const tiles = prepSource(layerInfo, source, date, knobPos, ctx).tiles;
          replaceRasterTiles(mbMap, id, tiles);
        }
        return;
      }

      console.log("here after upate")
      mbMap.setPaintProperty(
        id,
        'raster-opacity',
        parseInt(ctx.props.tileOpacity,10)/100
      );

      // Do not update if:
      if (
        // There's no date defined.
        prevProps.date &&
        date &&
        // Dates are the same
        date.getTime() === prevProps.date.getTime() &&
        // Knob position for gamma correction is the same.
        knobPos === knobPosPrev &&
        // Compare didn't change.
        comparing === prevProps.comparing
      ) { return; }

      // The source we're updating is not present.
      //console.log(mbMap.getSource(id))
      if (!mbMap.getSource(id)) return;

      // If we're comparing, and the compare map is not loaded.
      if (comparing && !mbMapComparingLoaded) return;

      // END update checks.

      // Update layer tiles.
      const tiles = prepSource(layerInfo, source, date, knobPos).tiles;

      replaceRasterTiles(mbMap, id, tiles);

      // Update/iniit compare layer tiles.
      if (comparing) {
        const compareDate =
          typeof compare.compareDate === 'function'
            ? compare.compareDate(date)
            // Default compare date is 5y ago.
            : sub(date, { years: 5 });

        const sourceCompare = prepSource(
          { ...layerInfo, ...compare },
          compare.source || source,
          compareDate,
          knobPos
        );
        if (mbMapComparing.getSource(comparingLayer.id)) {

        } else {

          if(mbMapComparing.getSource(prevComparingId)){
            mbMapComparing.removeLayer(prevComparingId);
            mbMapComparing.removeSource(prevComparingId);
          }

          mbMapComparing.addSource(comparingLayer.id, comparingLayer.compare.source);
          mbMapComparing.addLayer(
            {
              id: comparingLayer.id,
              type: 'raster',
              source: comparingLayer.id,
              paint: paint || {}
            },
            'admin-0-boundary-bg'
          );
          mbMap.setPaintProperty(
            id,
            'raster-opacity',
            parseInt(ctx.props.tileOpacity,10)/100
          );
        }
      }
    },
    hide: (ctx, layerInfo) => {
      const { mbMap } = ctx;
      const { id } = layerInfo;
      if (mbMap.getSource(id)) {
        mbMap.setLayoutProperty(id, 'visibility', 'none');
      }
    },
    show: (ctx, layerInfo) => {
      //console.log(ctx)
      const { mbMap, props } = ctx;
      const { id, source, paint } = layerInfo;
      const { date } = props;
      if (!date) return;

      if (mbMap.getSource(id)) {
        mbMap.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        mbMap.addSource(
          id,
          prepSource(layerInfo, source, date, layerInfo.knobCurrPos)
        );
        mbMap.addLayer(
          {
            id: id,
            type: 'raster',
            source: id,
            paint: paint || {}
          },
          'admin-0-boundary-bg'
        );
        mbMap.setPaintProperty(
          id,
          'raster-opacity',
          parseInt(ctx.props.tileOpacity,10)/100
        );
      }
    }
  },
  raster: {
    update: (ctx, layerInfo, prevProps, comparingLayer) => {
      const { mbMap, mbMapComparing, mbMapComparingLoaded, props } = ctx;
      const { id, compare, paint, source } = layerInfo;
      const { comparing } = props;

      // Check if the source tiles have changed and need to be replaced. This
      // may happen in the stories when maintaining the layer and changing the
      // spotlight. One example is the slowdown raster layer on la and sf.
      const sourceTiles = mbMap.getSource(id).tiles;
      const newSourceTiles = source.tiles;
      // Quick compare
      if (sourceTiles && sourceTiles.join('-') !== newSourceTiles.join('-')) {
        replaceRasterTiles(mbMap, id, newSourceTiles);
      }

      // Do not update if:
      if (
        // Compare didn't change.
        comparing === prevProps.comparing ||
        // There's no comparing map.
        !mbMapComparing
      ) { return; }

      // If we're comparing, and the compare map is not loaded.
      if (comparing && !mbMapComparingLoaded) return;

      // END update checks.

      if (mbMapComparing.getSource(comparingLayer.id)) {
        mbMapComparing.setLayoutProperty(comparingLayer.id, 'visibility', 'visible');
      } else {
        mbMapComparing.addSource(comparingLayer.id, comparingLayer.compare.source);
        mbMapComparing.addLayer(
          {
            id: comparingLayer.id,
            type: 'raster',
            source: comparingLayer.id,
            paint: paint || {}
          },
          'admin-0-boundary-bg'
        );
        mbMap.setPaintProperty(
          id,
          'raster-opacity',
          parseInt(ctx.props.tileOpacity,10)/100
        );
      }
    },
    hide: (ctx, layerInfo) => {
      const { mbMap } = ctx;
      const { id } = layerInfo;
      if (mbMap.getSource(id)) {
        mbMap.setLayoutProperty(id, 'visibility', 'none');
      }
    },
    show: (ctx, layerInfo) => {
      const { mbMap } = ctx;
      const { id, source, paint } = layerInfo;

      if (mbMap.getSource(id)) {
        mbMap.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        mbMap.addSource(id, source);
        mbMap.addLayer(
          {
            id: id,
            type: 'raster',
            source: id,
            paint: paint || {}
          },
          'admin-0-boundary-bg'
        );
        mbMap.setPaintProperty(
          id,
          'raster-opacity',
          parseInt(ctx.props.tileOpacity,10)/100
        );
      }
    }
  }
};
