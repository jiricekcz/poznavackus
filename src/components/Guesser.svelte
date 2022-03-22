<script lang="ts">
    import API from "../scripts/api";
    import { Stats } from "../scripts/store";
    let correctTimes = Stats.correct;
    let attempts = Stats.attempts;
    export let collectionId: number;
    enum Correctness {
        Correct,
        Incorrect,
        NotGuessed,
    }
    let showTip = false;
    let inputEl: HTMLInputElement;
    let correct: Correctness = Correctness.NotGuessed;
    let collection: API.Collection;
    let element: API.Element;
    API.Poznvackus.fetch().then((p) => {
        p.getCollection(collectionId).then(async (c) => {
            collection = c;
            element = await c.getRandomElement();
        });
    });

    let input: string;

    async function validate(): Promise<void> {
        if (input == "") return;
        if (element.isValidName(input)) {
            correct = Correctness.Correct;
            await delay(1000);
            input = "";
            refresh();
            correctTimes.update((v) => v + 1);
            attempts.update((v) => v + 1);
        } else {
            correct = Correctness.Incorrect;
            await delay(2000);
            input = "";
            correct = Correctness.NotGuessed;
            inputEl.focus();
            attempts.update((v) => v + 1);
        }
    }
    async function refresh(): Promise<void> {
        element = await collection.getRandomElement();
        showTip = false;
        correct = Correctness.NotGuessed;
    }
    function delay(delay: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, delay);
        });
    }
    async function reveal(): Promise<void> {
        correct = Correctness.Incorrect;
        input = element.name;
        showTip = true;
        let additionalDelay = element.tip?.length * 1000 / 24 || 0; // Average reading speed is 240 words per minute ~ 24 characters per second
        await delay(2000 + additionalDelay);
        input = "";
        attempts.update((v) => v + 1);
        refresh();
    }
    document.addEventListener("keyup", (ev) => {
        if (ev.key == "Enter") {
            validate();
        }
        if (ev.key == "Escape") {
            reveal();
        }
    });
</script>

<main class="container">
    <div class="element">
        <p>{$correctTimes} / {$attempts}</p>
    </div>
    <div class="element">
        {#if element}
            <img src={element.getRandomImage()} alt="T" />
        {/if}
    </div>
    <div class="element">
        <table>
            <tbody>
                <tr>
                    <td>
                        <input
                            bind:this={inputEl}
                            autofocus
                            disabled={correct != Correctness.NotGuessed}
                            type="text"
                            bind:value={input}
                            class={correct == Correctness.NotGuessed
                                ? "neutral"
                                : correct == Correctness.Correct
                                ? "correct"
                                : "incorrect"}
                        />
                    </td>
                    <td>
                        <button on:click={validate} class="green">Validate</button>
                    </td>
                    <td>
                        <button on:click={reveal} class="red">IDK</button>
                    </td>
                </tr>
            </tbody>
        </table>
        {#if showTip && element?.tip} 
            <div class="element">
                <span>TIP: {element.tip}</span>
            </div>
        {/if}
    </div>
</main>
<svelte:head>
    {#if collection}
        <title>{collection.name}</title>
    {/if}
</svelte:head>

<style>
    .correct {
        color: green;
    }
    .incorrect {
        color: red;
    }
    .neutral {
        color: gray;
    }
    .container {
        margin: auto;
        width: 60vw;
        margin-top: 5vh;
        background-color: rgba(57, 128, 0, 0.233);
        padding: 2vh;
        border-radius: 25px;
    }
    .element {
        display: grid;
        padding-top: 2vh;
        padding-bottom: 2vh;
    }
    .element img {
        margin: auto;
        height: 60vh;
    }
    .element table {
        margin: auto;
        width: 10vw;
    }

    .element p {
        font-size: 5vh;
        height: 5vh;
        margin: auto;
    }
    .red {
        color: red;
    }
    .green { 
        color: green;
    }
    .element span { 
        height: 5vh;
        margin: auto;
    }
</style>
