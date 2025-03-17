export default function getSearch() {
    const search = new URLSearchParams(window.location.search);
    const keys = search.keys();

    const returnValue = {};
    for (const k of keys) {
        const value = search.get(k);
        returnValue[k] = (value.length > 1)? value: value[0];
    }

    return returnValue;
}

export function getSearchParam<T = string>(k: string) {
    return getSearch()?.[k] as T;
}