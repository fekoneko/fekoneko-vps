<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  const props: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M4 12h16m0 0l-6-6m6 6l-6 6"
  />
</svg>
