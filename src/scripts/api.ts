namespace API {
    export const URL = `https://data.poznavacka.jiri.pro`;
    export class Poznvackus {
        public readonly collectionCount: number;
        public readonly collectionMetadata: CollectionMetadata[];

        private collectionCache: Array<Collection> = [];

        constructor(
            collectionCount: number,
            collectionMetadata: CollectionMetadata[]
        ) {
            this.collectionCount = collectionCount;
            this.collectionMetadata = collectionMetadata;
        }

        public static async fetch(): Promise<Poznvackus> {
            const response = await fetch(`${URL}/index.json`);
            const data: PoznvackusData = await response.json();
            return new Poznvackus(data.collections.length, data.collections);
        }

        public async getCollection(id: number): Promise<Collection> {
            if (id >= this.collectionCount)
                throw new Error("Invalid Collection ID.");
            if (this.collectionCache[id]) {
                return this.collectionCache[id];
            }
            this.collectionCache[id] = await Collection.fetch(id);
            return this.getCollection(id);
        }
    }
    export class Collection {
        public readonly name: string;
        public readonly id: number;
        public elementCount: number;

        private elementCache: Array<Element> = [];
        constructor(name: string, id: number, elementCount: number) {
            this.name = name;
            this.id = id;
            this.elementCount = elementCount;
        }

        async getElement(id: number): Promise<Element> {
            if (id >= this.elementCount) throw new Error("Invalid Element ID.");
            if (this.elementCache[id]) {
                return this.elementCache[id];
            }
            this.elementCache[id] = await Element.fetch(this.id, id);
            return this.getElement(id);
        }
        async getRandomElement(): Promise<Element> {
            return this.getElement(this.randomElementId());
        }
        public static async fetch(id: number): Promise<Collection> {
            const response = await fetch(`${URL}/${id}/index.json`);
            const data: CollectionData = await response.json();
            return new Collection(data.name, data.id, data.elementCount);
        }

        private randomElementId() {
            return Math.floor(Math.random() * this.elementCount);
        }
    }
    export class Element {
        public readonly name: string;
        public readonly otherValidNames: string[];
        public readonly imageUrls: string[];
        constructor(
            name: string,
            otherValidNames: string[],
            imageUrls: string[]
        ) {
            this.name = name;
            this.otherValidNames = otherValidNames;
            this.imageUrls = imageUrls;
        }

        public static async fetch(collectionId: number, elementId: number) {
            const response = await fetch(
                `${URL}/${collectionId}/${elementId}.json`
            );
            const data: ElementData = await response.json();
            return new Element(data.name, data.otherValidNames, data.images);
        }

        getRandomImage(): string {
            return this.imageUrls[
                Math.floor(Math.random() * this.imageUrls.length)
            ];
        }
        isValidName(name: string): boolean {
            return (
                name.toLowerCase() == this.name.toLowerCase() ||
                this.otherValidNames
                    .map((v) => v.toLowerCase())
                    .includes(name.toLowerCase())
            );
        }
    }

    export interface PoznvackusData {
        collections: Array<PoznavackusCollectionData>;
    }
    export interface PoznavackusCollectionData {
        name: string;
        id: number;
        path: string;
        mainFile: string;
    }
    export interface CollectionData {
        name: string;
        id: number;
        elementCount: number;
    }
    export interface CollectionMetadata {
        name: string;
    }
    export interface ElementData {
        name: string;
        otherValidNames: string[];
        images: string[];
    }
}
export default API;
