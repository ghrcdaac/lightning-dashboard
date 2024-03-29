// used by layer-legend

import React from 'react';

/**
 * Rounds a number to a specified amount of decimals.
 *
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to keep. Default to 2
 */
export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function shortenLargeNumber (value, decimals = 2) {
  if (value / 1e9 >= 1) {
    return {
      num: round(value / 1e9, decimals),
      unit: 'B'
    };
  } else if (value / 1e6 >= 1) {
    return {
      num: round(value / 1e6, decimals),
      unit: 'M'
    };
  } else if (value / 1e3 >= 1) {
    return {
      num: round(value / 1e3, decimals),
      unit: 'K'
    };
  }
  return {
    num: value,
    unit: ''
  };
}

/**
 * Adds a separator every 3 digits and rounds the number.
 *
 * @param {number} num The number to format.
 * @param {object} options Options for the formatting.
 * @param {number} options.decimals Amount of decimals to keep. (Default 2)
 * @param {string} options.separator Separator to use. (Default ,)
 * @param {boolean} options.forceDecimals Force the existence of decimal. (Default false)
 *                  Eg: Using 2 decimals and force `true` would result:
 *                  formatThousands(1 /2, { forceDecimals: true }) => 0.50
 * @param {boolean} options.shorten Shorten large numbers. (Default false)
 *                  Shortening is done for millions and billions.
 *                  formatThousands(10000000, { shorten: true }) => 10M
 *
 * @example
 * formatThousands(1)               1
 * formatThousands(1000)            1,000
 * formatThousands(10000000)        10,000,000
 * formatThousands(1/3)             0.33
 * formatThousands(100000/3)        33,333.33
 * formatThousands()                --
 * formatThousands('asdasdas')      --
 * formatThousands(1/2, { decimals: 0 })                        1
 * formatThousands(1/2, { decimals: 0, forceDecimals: true})    1
 * formatThousands(1/2, { decimals: 5 })                        0.5
 * formatThousands(1/2, { decimals: 5, forceDecimals: true})    0.50000
 *
 */
export function formatThousands (num, options) {
  const opts = {
    decimals: 2,
    separator: ',',
    forceDecimals: false,
    shorten: false,
    ...options
  };

  // isNaN(null) === true
  if (isNaN(num) || (!num && num !== 0)) {
    return '--';
  }

  const repeat = (char, length) => {
    let str = '';
    for (let i = 0; i < length; i++) str += char + '';
    return str;
  };

  let [int, dec] = Number(round(num, opts.decimals))
    .toString()
    .split('.');

  let largeNumUnit = '';
  if (opts.shorten) {
    const { num, unit } = shortenLargeNumber(int, 0);
    int = num.toString();
    largeNumUnit = unit;
  }

  // Space the integer part of the number.
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, opts.separator);
  // Round the decimals.
  dec = (dec || '').substr(0, opts.decimals);
  // Add decimals if forced.
  dec = opts.forceDecimals ? `${dec}${repeat(0, opts.decimals - dec.length)}` : dec;

  return dec !== '' ? `${int}.${dec} ${largeNumUnit}` : `${int} ${largeNumUnit}`;
}

// Add zero leading decimals
export const zeroPad = v => v < 10 ? `0${v}` : v;

/**
 * Replaces the character ₂ (\u2082) with a sub tag.
 *
 * @param {string} input Input string
 *
 * @returns React component
 */
export const replaceSub2 = (input) => {
  if (!input.split) return input;
  const content = input.split('\u2082');

  return content.reduce(
    (accum, el, ind) =>
      ind < content.length - 1
        ? [...accum, el, <sub key={el}>2</sub>]
        : [...accum, el],
    []
  );
};
