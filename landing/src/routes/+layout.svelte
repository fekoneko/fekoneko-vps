<script lang="ts">
  import { fly, type FlyParams } from 'svelte/transition';
  import '../app.css';
  import type { Snippet } from 'svelte';
  import { expoOut } from 'svelte/easing';

  export let data: { pathname: string };
  export let children: Snippet;

  $: direction = 'left' as 'left' | 'right';
  let prevPathname = data.pathname;
  let params: FlyParams = { duration: 1000, opacity: 1, easing: expoOut };

  $: if (prevPathname !== data.pathname) {
    if (data.pathname.startsWith(prevPathname)) direction = 'right';
    else direction = 'left';
    prevPathname = data.pathname;
  }
</script>

<div class="relative size-full bg-gradient-to-tl from-rose-300 to-orange-200">
  {#key data.pathname}
    <div
      class="absolute size-full p-4"
      in:fly={{ x: direction === 'left' ? '-100%' : '100%', ...params }}
      out:fly={{ x: direction === 'left' ? '100%' : '-100%', ...params }}
    >
      <div
        class="scroll-hidden flex size-full flex-col items-center justify-center gap-8 overflow-x-hidden overflow-y-scroll rounded-3xl bg-white p-8 shadow-xl shadow-rose-900/5 transition-all duration-300 sm:gap-12 md:p-12"
      >
        {@render children()}
      </div>
    </div>
  {/key}
</div>
