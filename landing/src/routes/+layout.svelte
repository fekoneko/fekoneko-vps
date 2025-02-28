<script lang="ts">
  import { fly, type FlyParams } from 'svelte/transition';
  import '../app.css';
  import { cubicOut } from 'svelte/easing';

  const TRANSITION_PARAMS: FlyParams = { duration: 800, opacity: 1, easing: cubicOut };

  const { data, children } = $props();
  const pathname = $derived(data.pathname);
  let isRightTransition = $state(false);
  let prevPathname: string;

  $effect(() => {
    isRightTransition = pathname.startsWith(prevPathname);
    prevPathname = pathname;
  });
</script>

<div class="relative size-full bg-gradient-to-tl from-rose-300 to-orange-200">
  {#key pathname}
    <div
      class="absolute size-full p-4"
      in:fly={{ x: isRightTransition ? '-100%' : '100%', ...TRANSITION_PARAMS }}
      out:fly={{ x: isRightTransition ? '100%' : '-100%', ...TRANSITION_PARAMS }}
    >
      <div
        class="flex size-full flex-col items-center justify-center gap-8 overflow-y-auto overflow-x-hidden rounded-3xl bg-white p-8 shadow-xl shadow-rose-900/5 transition-all duration-300 sm:gap-12 md:p-12"
      >
        {@render children()}
      </div>
    </div>
  {/key}
</div>
