<script lang="ts">
    export var collectionId: number;
    import API from "../scripts/api";

    let els: API.Element[] = [];
    const p = API.Poznvackus.fetch().then(async (p) => {
        const c = await p.getCollection(collectionId);
        const elsp: Promise<API.Element>[] = [];
        for (let i = 0; i < c.elementCount; i++) {
            elsp.push(c.getElement(i));
        }
        els = await Promise.all(elsp);
    });
</script>

<main>
    <ul>
        {#each els as el}
            <div>
                <h2>{el.name}</h2>
                <img class="elementImg" src={el.getRandomImage()} alt="" />
            </div>
        {/each}
    </ul>
</main>

<style>
    .elementImg {
        width: 40 vw;
    }
</style>
