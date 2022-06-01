<script lang="ts">
  import Guesser from "./components/Guesser.svelte";
  import All from "./components/All.svelte";
  var url = new URLSearchParams(window.location.search);
  let collectionId = parseInt(url.get("collectionId")) || 2;
  let all = url.get("all") === "true"
</script>

<main>
  {#if !all}
  <Guesser {collectionId}/>
  {/if}
  {#if all}
  <All {collectionId}/>
  {/if}
</main>

<style>
</style>
