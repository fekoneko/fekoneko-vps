<script lang="ts">
  import ArrowLink from '$lib/components/ArrowLink.svelte';
</script>

<svelte:head>
  <title>About @ fekoneko VPS</title>
</svelte:head>

<div class="relative flex w-full items-center justify-start max-[22rem]:**:[p]:hidden">
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
    <p class="xs:text-2xl text-center text-[1.35rem] text-neutral-500 **:font-normal">
      I&nbsp;love&nbsp;open&nbsp;source,&nbsp;open art&nbsp;and&nbsp;open&nbsp;people
    </p>
    <p class="text-center text-lg text-neutral-400">
      Also&nbsp;I've&nbsp;heard&nbsp;that&nbsp;hosting everything&nbsp;yourself&nbsp;is&nbsp;cool
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
