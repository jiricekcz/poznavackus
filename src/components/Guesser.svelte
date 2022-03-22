<script lang="ts">
    import API from "../scripts/api";
    export let collectionId: number;
    enum Correctness { Correct, Incorrect, NotGuessed }

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
        if (element.isValidName(input)) {
            correct = Correctness.Correct;
            await delay(1000);
            input = "";
            refresh();
        } else {
            correct = Correctness.Incorrect;
            await delay(2000);
            input = "";
            correct = Correctness.NotGuessed;
            inputEl.focus();
        }
    }
    async function refresh(): Promise<void> {
        element = await collection.getRandomElement();
        correct = Correctness.NotGuessed;
    }
    function delay(delay: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, delay);
        });
    }
    document.addEventListener("keyup", (ev) => { 
        if (ev.key == "Enter") {
            validate();
        }
    })
</script>

<div>
    <div>
        {#if element}
            <img src={element.getRandomImage()} alt="T" width ="512px"/>
        {/if}
    </div>
    <div>
        <table>
            <tbody>
                <tr>
                    <td>
                        <input bind:this={inputEl} autofocus disabled="{correct != Correctness.NotGuessed}" type="text" bind:value={input} class="{correct == Correctness.NotGuessed ? "neutral" : correct == Correctness.Correct ? "correct" : "incorrect"}"/>
                    </td>
                    <td>
                        <button on:click={validate}>Validate</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<style>
    .correct {
        color: green
    }
    .incorrect {
        color: red
    }
    .neutral {
        color: gray;
    }
</style>