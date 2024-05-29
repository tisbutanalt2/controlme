export default function pickRandom<T extends Array<any>>(arr: T): T[0] {
    if (arr.length <= 1) return arr[0];
    return arr[
        Math.floor(
            (Math.random() * (arr.length - 1)) + 0.5
        )
    ]
}