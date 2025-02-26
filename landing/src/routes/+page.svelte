<script lang="ts">
  import { PUBLIC_MAIN_DOMAIN_NAME as MAIN_DOMAIN } from '$env/static/public';
  import ServiceCard from '$lib/ServiceCard.svelte';
</script>

<div class="size-full bg-gradient-to-tl from-rose-300 to-orange-200 p-6">
  <div
    class="flex size-full flex-col items-center justify-center gap-12 rounded-3xl bg-white p-8 shadow-xl shadow-rose-900/5 md:p-12"
  >
    <div class="grow sm:h-16"></div>

    <h1 class="text-center font-serif text-5xl font-bold text-pink-950 sm:text-6xl">
      Welcome to
      <span class="text-pink-600">{MAIN_DOMAIN}</span>
    </h1>

    <section
      class="grid w-full max-w-[48rem] grow grid-cols-1 content-end gap-4 sm:grid-cols-3 sm:gap-8"
    >
      <ServiceCard href="https://searxng.{MAIN_DOMAIN}" name="SearXNG" color="indigo" />
      <ServiceCard href="https://traefik.{MAIN_DOMAIN}" name="Traefik" color="emerald" />
      <ServiceCard href="https://wireguard.{MAIN_DOMAIN}" name="WireGuard" color="fuchsia" />
    </section>
  </div>
</div>
