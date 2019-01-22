/**
 * @module HelixUI/Utils/Alignment
 * @description
 * Alignment logic in regards to positioning
 *
 * See https://codepen.io/CITguy/pen/b1286136d695391a40a6d708b765361c
 */

/**
 * @global
 * @typedef {String} AlignmentString
 * @description
 *
 * Values:
 * * `bottom`
 * * `center`
 * * `end`
 * * `left`
 * * `middle`
 * * `right`
 * * `start`
 * * `top`
 */

/**
 * @global
 * @typedef {String} NormalizedPositionString
 * @description
 *
 * Values:
 * * `bottom-center`
 * * `bottom-end`
 * * `bottom-left`
 * * `bottom-right`
 * * `bottom-start`
 * * `center-middle`
 * * `left-bottom`
 * * `left-end`
 * * `left-middle`
 * * `left-start`
 * * `left-top`
 * * `right-bottom`
 * * `right-end`
 * * `right-middle`
 * * `right-start`
 * * `right-top`
 * * `top-center`
 * * `top-end`
 * * `top-left`
 * * `top-right`
 * * `top-start`
 */

/**
 * @global
 * @typedef {String} PositionString
 * @description Union of
 * {@link SimplePositionString} and
 * {@link NormalizedPositionString}
 */

/**
 * @global
 * @typedef {String} SimplePositionString
 * @description
 *
 * Values:
 * * `bottom`
 * * `center`
 * * `left`
 * * `right`
 * * `top`
 */

const AXES = {
    X: 1,
    Y: 2,
};

const OPPOSITE_ALIGNMENTS = {
    'bottom': 'top',
    'center': 'center',
    'end': 'start',
    'left': 'right',
    'middle': 'middle',
    'right': 'left',
    'start': 'end',
    'top': 'bottom',
};

/**
 * Convert position string into vertical alignment, horizontal alignment,
 * and main axis properties.
 *
 * @param {PositionString} position user-configured position string
 * @returns {Object} alignment metadata
 */
export function getAlignment (position) {
    let crossAlign; // cross-axis alignment
    let crossAxis = getCrossAxis(position);
    let mainAlign; // main-axis alignment
    let mainAxis = getMainAxis(position);
    // x-axis and y-axis alignment (in relation to viewport coordinates)
    let yAlign = getVerticalAlignment(position);
    let xAlign = getHorizontalAlignment(position);

    // https://regex101.com/r/1oRJf8/7
    let startEndMatch = position.match(/(start|end)$/);
    if (startEndMatch) {
        if (mainAxis === AXES.X) {
            yAlign = startEndMatch[0];
        } else {
            xAlign = startEndMatch[0];
        }
    }

    // determine main-axis and cross-axis alignment
    if (mainAxis === AXES.X) {
        mainAlign = xAlign;
        crossAlign = yAlign;
    } else {
        mainAlign = yAlign;
        crossAlign = xAlign;
    }

    return {
        crossAlign,
        crossAxis,
        xAlign,
        mainAlign,
        mainAxis,
        yAlign,
    };
}

/**
 * Determine secondary axis (x or y; opposite of main axis) from position.
 *
 * @param {PositionString} position
 * @returns {Enum<String>}
 */
export function getCrossAxis (position) {
    return (getMainAxis(position) === AXES.X ? AXES.Y : AXES.X);
}

/**
 * Determine x-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
export function getHorizontalAlignment (position) {
    let xAlign = 'center';

    // https://regex101.com/r/1oRJf8/5
    let hMatch = position.match(/^(left|right)|(left|right)$/);
    if (hMatch) {
        xAlign = hMatch[0];
    }

    return xAlign;
}

/**
 * Determine primary axis (x or y) from position
 *
 * @param {PositionString} position
 * @returns {Enum}
 */
export function getMainAxis (position) {
    // https://regex101.com/r/1oRJf8/1
    if (/^(top|bottom)/.test(position)) {
        return AXES.Y;
    } else {
        return AXES.X;
    }
}

/**
 * Determine y-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
export function getVerticalAlignment (position) {
    let yAlign = 'middle';

    // https://regex101.com/r/1oRJf8/4
    let vMatch = position.match(/^(top|bottom)|(top|bottom)$/);
    if (vMatch) {
        yAlign = vMatch[0];
    }

    return yAlign;
}

/**
 * Calculates position string that is horizontally opposite of given position.
 *
 * @param {NormalizedPositionString} position
 * @returns {NormalizedPositionString} horizontally inverted position string
 */
export function invertPositionHorizontally (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newXAlign = OPPOSITE_ALIGNMENTS[xAlign];
    return mainAxis === AXES.X ? `${newXAlign}-${yAlign}` : `${yAlign}-${newXAlign}`;
}

/**
 * Calculates position string that is vertically opposite of given position.
 *
 * @param {NormalizedPositionString} position
 * @returns {NormalizedPositionString} vertically inverted position string
 */
export function invertPositionVertically (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newYAlign = OPPOSITE_ALIGNMENTS[yAlign];
    return mainAxis === AXES.X ? `${xAlign}-${newYAlign}` : `${newYAlign}-${xAlign}`;
}

/**
 * Normalize user-configured position to "{mainAlign}-{crossAlign}" format.
 *
 * - "top" -> "top-center"
 * - "right" -> "right-middle"
 * - "center" -> "center-middle"
 * - etc.
 *
 * @param {PositionString} position
 * @returns {NormalizedPositionString}
 */
export function normalizePosition (position) {
    let { crossAlign, mainAlign } = getAlignment(position);
    return `${mainAlign}-${crossAlign}`;
}

/**
 * @param {NormalizedPositionString} position
 * @param {PredicateCollisions} collides
 */
export function optimizePositionForCollisions (position, collides) {
    let { xAlign, yAlign } = getAlignment(position);

    // COLLIDE TOP
    // 'top-*' -> 'bottom-*' (CHANGE)
    // '{H}-top' -> '{H}-bottom' (CHANGE)
    // 'bottom-*' -> 'bottom-*' (no change)
    // '{H}-bottom' -> '{H}-bottom' (no change)
    // '{H}-start|middle|end' -> '{H}-start|middle|end' (no change)
    if (collides.top && yAlign === 'top') {
        position = invertPositionVertically(position);
    }

    // COLLIDE BOTTOM
    // 'bottom-*' -> 'top-*' (CHANGE)
    // '{H}-bottom' -> '{H}-top' (CHANGE)
    // 'top-*' -> 'top-*' (no change)
    // '{H}-top' -> '{H}-top' (no change)
    // '{H}-start|middle|end' -> '{H}-start|middle|end' (no change)
    if (collides.bottom && yAlign === 'bottom') {
        position = invertPositionVertically(position);
    }

    // COLLIDE LEFT
    // 'left-*' -> 'right-*' (CHANGE)
    // '{V}-left' -> '{V}-right' (CHANGE)
    // 'right-*' -> 'right-*' (no change)
    // '{V}-right' -> '{V}-right' (no change)
    // '{V}-start|center|end' -> '{V}-start|center|end' (no change)
    if (collides.left && xAlign === 'left') {
        position = invertPositionHorizontally(position);
    }

    // COLLIDE RIGHT
    // 'right-*' -> 'left-*' (CHANGE)
    // '{V}-right' -> '{V}-left' (CHANGE)
    // 'left-*' -> 'left-*' (no change)
    // '{V}-left' -> '{V}-left' (no change)
    // '{V}-start|center|end' -> '{V}-start|center|end' (no change)
    if (collides.right && xAlign === 'right') {
        position = invertPositionHorizontally(position);
    }

    // TODO: What if both sides of an axis collide?
    // e.g., both left/right or top/bottom collide

    return position;
}

export default {
    getAlignment,
    getCrossAxis,
    getHorizontalAlignment,
    getMainAxis,
    getVerticalAlignment,
    invertPositionHorizontally,
    invertPositionVertically,
    normalizePosition,
    optimizePositionForCollisions,
};
