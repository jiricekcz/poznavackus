namespace API {
    export const URL = `https://data.poznavacka.jiri.pro`;
    export const GithubURL = "https://github.com/jiricekcz/poznavackus-data/blob/main/"
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
            const response = await fetch(`${URL}/index.json`, {mode: "no-cors"});
            const data: PoznvackusData = await response.json();
            return new Poznvackus(data.collections.length, data.collections);
        }

        public async getCollection(id: number): Promise<Collection> {
            if (id >= this.collectionCount)
                throw new Error("Invalid Collection ID.");
            if (this.collectionCache[id]) {
                return this.collectionCache[id];
            }
            this.collectionCache[id] = await Collection.fetch(this, id);
            return this.getCollection(id);
        }
        getUrl(): string {
            return `${API.GithubURL}/index.json`;
        }
    }
    export class Collection {
        public poznavackus: Poznvackus;
        public readonly name: string;
        public readonly id: number;
        public elementCount: number;

        private elementCache: Array<Element> = [];
        constructor(poznavackus: Poznvackus, name: string, id: number, elementCount: number) {
            this.name = name;
            this.id = id;
            this.elementCount = elementCount;
            this.poznavackus = poznavackus;
        }

        async getElement(id: number): Promise<Element> {
            if (id >= this.elementCount) throw new Error("Invalid Element ID.");
            if (this.elementCache[id]) {
                return this.elementCache[id];
            }
            this.elementCache[id] = await Element.fetch(this, id);
            return this.getElement(id);
        }
        async getRandomElement(): Promise<Element> {
            return this.getElement(this.randomElementId());
        }
        public static async fetch(poznavackus: Poznvackus, id: number): Promise<Collection> {
            const response = await fetch(`${URL}/${id}/index.json`, {mode: "no-cors"});
            const data: CollectionData = await response.json();
            return new Collection(poznavackus, data.name, data.id, data.elementCount);
        }

        private randomElementId() {
            return Math.floor(Math.random() * this.elementCount);
        }
        getUrl() {
            return `${API.GithubURL}/${this.id}/index.json`;
        }
    }
    export class Element {
        public readonly collection: Collection;
        public readonly name: string;
        public readonly id: number;
        public readonly otherValidNames: string[];
        public readonly imageUrls: string[];
        public readonly tip?: string;
        constructor(
            collection: Collection,
            id: number,
            name: string,
            otherValidNames: string[],
            imageUrls: string[],
            tip?: string
        ) {
            this.id = id
            this.collection = collection;
            this.name = name;
            this.otherValidNames = otherValidNames;
            this.imageUrls = imageUrls;
            this.tip = tip;
        }

        public static async fetch(collection: Collection, elementId: number) {
            const response = await fetch(
                `${URL}/${collection.id}/${elementId}.json`
            );
            const data: ElementData = await response.json();
            return new Element(collection, elementId, data.name, data.otherValidNames, data.images, data.tip);
        }

        getRandomImage(): string {
            return this.imageUrls[
                Math.floor(Math.random() * this.imageUrls.length)
            ];
        }
        isValidName(name: string): boolean {
            return (
                name.toLowerCase().trim() == this.name.toLowerCase().trim() ||
                this.otherValidNames
                    .map((v) => v.toLowerCase().trim())
                    .includes(name.toLowerCase().trim())
            );
        }
        getUrl(): string {
            return `${API.GithubURL}/${this.collection.id}/${this.id}.json`;
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
        tip?: string;
    }
}
export default API;
