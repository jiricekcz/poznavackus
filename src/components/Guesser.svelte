<script lang="ts">
    import API from "../scripts/api";
    import {
        stats,
        ratioString,
        addMistake,
        addCorrect,
    } from "../scripts/store";
    import * as Store from "svelte/store";
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
    let image: string;

    let correctnessRatio: string = "";

    API.Poznvackus.fetch().then((p) => {
        p.getCollection(collectionId).then(async (c) => {
            collection = c;
            element = await c.getRandomElement();
            image = element.getRandomImage();
            correctnessRatio = await ratioString(collection.id);
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
            addCorrect(collection.id, element.id, image);
        } else {
            correct = Correctness.Incorrect;
            await delay(2000);
            input = "";
            correct = Correctness.NotGuessed;
            inputEl.focus();
            addMistake(collection.id, element.id, image);
        }
    }
    async function refresh(): Promise<void> {
        element = await collection.getRandomElement();
        image = element.getRandomImage();
        showTip = false;
        correct = Correctness.NotGuessed;
        correctnessRatio = await ratioString(collection.id);
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
        let additionalDelay = (element.tip?.length * 1000) / 24 || 0; // Average reading speed is 240 words per minute ~ 24 characters per second
        await delay(2000 + additionalDelay);
        input = "";
        addMistake(collection.id, element.id, image);
        refresh();
    }
    async function takeToApiLink(): Promise<void> {
        window.open(element.getUrl(), "_blank");
    }
    document.addEventListener("keyup", (ev) => {
        if (correct != Correctness.NotGuessed) return;
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
        {#if collection}
            <p>{correctnessRatio}</p>
        {/if}
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
                        <button
                            on:click={validate}
                            class="green"
                            disabled={correct != Correctness.NotGuessed}
                            >Validate</button
                        >
                    </td>
                    <td>
                        <button
                            on:click={reveal}
                            class="red"
                            disabled={correct != Correctness.NotGuessed}
                            >IDK</button
                        >
                    </td>
                    <td>
                        <button
                            on:click={takeToApiLink}
                            class="blue"
                            disabled={correct != Correctness.NotGuessed}
                            >API</button
                        >
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
    @media only screen and (max-width: 700px) {
        .element img {
            height: auto;
            width: 100%;
        }
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
    .blue {
        color: blue;
    }
    .element span {
        height: 5vh;
        margin: auto;
    }
</style>
