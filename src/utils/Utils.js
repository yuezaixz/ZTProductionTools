'use strict'

export function _number_is_Integer(number) {
    return typeof number === "number" && isFinite(number) && Math.floor(number) === number;
}