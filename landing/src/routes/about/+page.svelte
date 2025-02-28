<script lang="ts">
  import ArrowLink from '$lib/components/ArrowLink.svelte';
</script>

<div class="max-[22rem]:**:[p]:hidden relative flex w-full items-center justify-start">
  <h2
    class="xs:px-5 xs:text-3xl pointer-events-none absolute mb-1 w-full px-1.5 text-right text-2xl font-bold text-pink-950 sm:text-center"
  >
    About me
  </h2>
  <ArrowLink href="/" label="Back" direction="left" />
</div>

<figure class="flex grow flex-col items-center gap-6">
  <img
    src="/fekoneko-avatar.jpg"
    alt="fekoneko avatar"
    class="xs:size-48 size-40 rounded-full border-4 border-dashed border-neutral-200"
  />
  <figcaption class="xs:text-3xl text-center text-2xl font-bold text-pink-600">fekoneko</figcaption>
</figure>

<a
  href="https://github.com/fekoneko"
  class="-mx-20 -my-4 px-20 py-4 text-lg text-neutral-500 underline-offset-4 hover:text-neutral-700 hover:underline focus:text-neutral-700 focus:underline focus:outline-none"
  >GitHub</a
>
