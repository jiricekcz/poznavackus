import * as Store from "svelte/store";

const defaultStats: Stats = {
    collections: [],
};
let s = localStorage.getItem("stats");
if (!s?.startsWith("{")) s = JSON.stringify(defaultStats);
console.log(s);
export const stats = Store.writable<Stats>(
    JSON.parse(s)
);
ratioString(1).then(console.log)

stats.subscribe((value: Stats) => {
    localStorage.setItem("stats", JSON.stringify(value));
});
export interface Stats {
    collections: Array<CollectionStats>;
}
export interface CollectionStats {
    ratio: Ratio;
    elements: Array<ElementStats>;
}
export interface ElementStats {
    images: Map<string, Ratio>;
    ratio: Ratio;
}
export interface Ratio {
    attempts: number;
    correct: number;
}

export function addMistake(
    collectionId: number,
    elementId: number,
    url: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        stats.update((value: Stats) => {
            console.log(value);
            if (!value.collections[collectionId])
                value.collections[collectionId] = {
                    ratio: { attempts: 0, correct: 0 },
                    elements: [],
                };
            const collection = value.collections[collectionId];

            if (!collection.elements[elementId])
                collection.elements[elementId] = {
                    images: new Map(),
                    ratio: { attempts: 0, correct: 0 },
                };
            const element = collection.elements[elementId];

            if (!element.images.get(url))
                element.images.set(url, { attempts: 0, correct: 0 });

            element.images.get(url).attempts++;
            element.ratio.attempts++;
            collection.ratio.attempts++;

            resolve();
            return value;
        });
    });
}
export function addCorrect(
    collectionId: number,
    elementId: number,
    url: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        stats.update((value: Stats) => {
            if (!value.collections[collectionId])
                value.collections[collectionId] = {
                    ratio: { attempts: 0, correct: 0 },
                    elements: [],
                };
            const collection = value.collections[collectionId];

            if (!collection.elements[elementId])
                collection.elements[elementId] = {
                    images: new Map(),
                    ratio: { attempts: 0, correct: 0 },
                };
            const element = collection.elements[elementId];

            if (!element.images.get(url))
                element.images.set(url, { attempts: 0, correct: 0 });

            element.images.get(url).attempts++;
            element.images.get(url).correct++;
            element.ratio.attempts++;
            element.ratio.correct++;
            collection.ratio.attempts++;
            collection.ratio.correct++;

            resolve();
            return value;
        });
    });
}

export function ratioString(collectionId: number): Promise<string> {
    return new Promise((resolve, reject) => {
        stats.update((value) => {
            const collection = value.collections[collectionId];
            if (!collection) return (resolve(""), value);
            const ratio = collection.ratio;
            resolve(`${ratio.correct} / ${ratio.attempts}`);
            return value;
        });
    });
}
