export const getField = (keys, object) => keys.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object);