<script lang="ts">
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type $$Props = HTMLButtonAttributes;
</script>

<button
  {...$$props}
  class={[
    '-mx-44 -my-28 flex items-start justify-end rounded-full px-44 py-28 hover:*:translate-x-2 hover:*:text-neutral-600 focus:outline-none focus:*:translate-x-2 focus:*:text-neutral-600 sm:-mx-72 sm:-my-64 sm:px-72 sm:py-64',
    $$props.class,
  ]}
>
  <ArrowRightIcon class="xs:size-16 size-14 text-neutral-300 transition-all duration-300" />
</button>
