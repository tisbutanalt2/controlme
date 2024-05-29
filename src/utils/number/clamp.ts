export default function clamp(num: number, min: number = -Infinity, max: number = Infinity) {
    return Math.min(
        Math.max(num, min),
        max
    );
}