<script lang="ts">
  import { PUBLIC_MAIN_DOMAIN_NAME as MAIN_DOMAIN } from '$env/static/public';
  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import ServiceLink from '$lib/components/ServiceLink.svelte';
</script>

<svelte:head>
  <title>fekoneko VPS</title>
</svelte:head>

<div class="flex h-8 w-full grow items-start justify-end sm:h-16">
  <ArrowLink href="/about" label="About" direction="right" />
</div>

<h1
  class="xs:text-5xl text-center font-serif text-4xl font-bold text-pink-950 transition-all duration-300 sm:text-6xl"
>
  Welcome to
  <span class="text-pink-600">fekoneko&nbsp;VPS</span>
</h1>

<section
  class="grid w-full max-w-[45rem] grow grid-cols-1 content-end gap-4 sm:grid-cols-2 md:gap-6 lg:max-w-[55rem] lg:grid-cols-4"
>
  <ServiceLink href="https://searxng.{MAIN_DOMAIN}" name="SearXNG" color="indigo" />
  <ServiceLink href="https://nextcloud.{MAIN_DOMAIN}" name="Nextcloud" color="sky" />
  <ServiceLink href="https://wireguard.{MAIN_DOMAIN}" name="WireGuard" color="fuchsia" />
  <ServiceLink href="https://traefik.{MAIN_DOMAIN}" name="Traefik" color="emerald" />
</section>
