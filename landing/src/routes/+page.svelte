<script lang="ts">
  import { PUBLIC_MAIN_DOMAIN_NAME as MAIN_DOMAIN } from '$env/static/public';
  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import ServiceLink from '$lib/components/ServiceLink.svelte';
</script>

<svelte:head>
  <title>fekoneko VPS</title>
</svelte:head>

<div class="flex h-0 w-full grow items-start justify-end sm:h-16">
  <ArrowLink href="/about" label="About" direction="right" />
</div>

<h1
  class="xs:text-5xl text-center font-serif text-4xl font-bold text-pink-950 transition-all duration-300 sm:text-6xl"
>
  Welcome to
  <span class="whitespace-nowrap text-pink-600">fekoneko VPS</span>
</h1>

<section
  class="grid w-full max-w-[45rem] grow grid-cols-1 content-end gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8"
>
  <ServiceLink href="https://searxng.{MAIN_DOMAIN}" name="SearXNG" color="indigo" />
  <ServiceLink href="https://traefik.{MAIN_DOMAIN}" name="Traefik" color="emerald" />
  <ServiceLink href="https://wireguard.{MAIN_DOMAIN}" name="WireGuard" color="fuchsia" />
</section>
