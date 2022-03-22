import * as Store from "svelte/store";

export const Stats = {
    attempts: Store.writable(Number(localStorage.getItem("attempts")) || 0),
    correct: Store.writable(Number(localStorage.getItem("correct")) || 0),
};
Stats.attempts.subscribe((value) =>
    localStorage.setItem("attempts", value.toString())
);
Stats.correct.subscribe((value) =>
    localStorage.setItem("correct", value.toString())
);
