<script lang="ts">
  function disableMenu() {
    // if (window.location.hostname !== "tauri.localhost") {
    //   return;
    // }

    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
  }

  function disableSelect() {
    window.addEventListener("selectstart", function (event) {
      event.preventDefault();
    });
  }

  disableMenu();
  disableSelect();
</script>

<div><h1>Hello, World!</h1></div>

<style>
  h1 {
    color: green;
  }
</style>
