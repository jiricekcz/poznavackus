<script lang="ts">
  import Guesser from "./components/Guesser.svelte";
  var url = new URLSearchParams(window.location.search);
  let collectionId = parseInt(url.get("collectionId")) | 0;
</script>

<main>
  <Guesser {collectionId}/>
</main>

<style>
</style>
