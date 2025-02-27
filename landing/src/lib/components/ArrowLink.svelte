<script lang="ts">
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  interface $$Props extends HTMLAnchorAttributes {
    direction: 'left' | 'right';
  }

  export let direction;
</script>

<a
  {...$$props}
  class={[
    '-mx-44 -my-28 flex items-start justify-end rounded-full px-44 py-28 hover:*:text-neutral-600 focus:outline-none focus:*:text-neutral-600 sm:-mx-72 sm:-my-64 sm:px-72 sm:py-64',
    direction === 'left' && 'hover:*:-translate-x-2 focus:*:-translate-x-2 sm:rotate-180',
    direction === 'right' && 'hover:*:translate-x-2 focus:*:translate-x-2',
    $$props.class,
  ]}
>
  <ArrowRightIcon class="xs:size-16 size-14 text-neutral-300 transition-all duration-300" />
</a>
