export function roundTo5(v: number): number {
    return Math.round(v / 5) * 5;
}

const pad = (m) => m < 10 ? '0' + m : m;
export function hour(minutes) {
    return Math.floor(minutes / 60) + ':' + pad(minutes % 60);
}
