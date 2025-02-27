<script lang="ts">
  import { PUBLIC_MAIN_DOMAIN_NAME as MAIN_DOMAIN } from '$env/static/public';
  import GoNextButton from '$lib/components/GoNextButton.svelte';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
</script>

<div class="size-full bg-gradient-to-tl from-rose-300 to-orange-200 p-6">
  <div
    class="scroll-hidden flex size-full flex-col items-center justify-center gap-12 overflow-x-hidden overflow-y-scroll rounded-3xl bg-white p-8 shadow-xl shadow-rose-900/5 md:p-12"
  >
    <div class="flex h-0 w-full grow items-start justify-end sm:h-16">
      <GoNextButton />
    </div>

    <h1
      class="xs:text-5xl text-center font-serif text-4xl font-bold text-pink-950 transition-all duration-300 sm:text-6xl"
    >
      Welcome to
      <span class="text-pink-600">{MAIN_DOMAIN}</span>
    </h1>

    <section
      class="grid w-full max-w-[45rem] grow grid-cols-1 content-end gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8"
    >
      <ServiceCard href="https://searxng.{MAIN_DOMAIN}" name="SearXNG" color="indigo" />
      <ServiceCard href="https://traefik.{MAIN_DOMAIN}" name="Traefik" color="emerald" />
      <ServiceCard href="https://wireguard.{MAIN_DOMAIN}" name="WireGuard" color="fuchsia" />
    </section>
  </div>
</div>
