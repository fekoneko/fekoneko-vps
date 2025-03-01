<script lang="ts">
  import ArrowLink from '$lib/components/ArrowLink.svelte';
</script>

<svelte:head>
  <title>About @ fekoneko VPS</title>
</svelte:head>

<div class="max-[22rem]:**:[p]:hidden relative flex w-full items-center justify-start">
  <h2
    class="xs:px-5 xs:text-3xl pointer-events-none absolute mb-1 w-full px-1.5 text-right text-2xl font-bold text-neutral-600 sm:text-center"
  >
    About me
  </h2>
  <ArrowLink href="/" label="Back" direction="left" />
</div>

<div class="flex grow flex-col gap-11">
  <figure class="flex flex-col items-center gap-6">
    <img
      src="/fekoneko-avatar.jpg"
      alt="fekoneko avatar"
      class="xs:size-48 size-40 rounded-full border-4 border-dashed border-neutral-200 transition-all"
    />
    <figcaption class="xs:text-3xl text-center text-2xl font-bold text-pink-600">
      fekoneko
    </figcaption>
  </figure>

  <div class="flex max-w-[24rem] flex-col gap-5 font-serif tracking-wider sm:max-w-none sm:gap-4">
    <p class="xs:text-2xl **:font-normal text-center text-[1.35rem] text-neutral-500">
      <span class="whitespace-nowrap">I love open source, open</span>{' '}
      <span class="whitespace-nowrap">art and open people</span>
    </p>
    <p class="text-center text-lg text-neutral-400">
      <span class="whitespace-nowrap">Also I've heard that hosting</span>{' '}
      <span class="whitespace-nowrap">everything yourself is cool</span>
    </p>
  </div>
</div>

<a
  href="https://github.com/fekoneko"
  target="_blank"
  class="-mx-20 -my-4 px-20 py-4 text-lg text-neutral-500 underline-offset-4 hover:text-neutral-700 hover:underline focus:text-neutral-700 focus:underline focus:outline-none"
>
  GitHub
</a>
