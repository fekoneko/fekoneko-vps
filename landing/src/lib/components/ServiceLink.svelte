<script lang="ts">
  import colors from 'tailwindcss/colors';

  export interface ServiceLinkProps {
    href: string;
    name: string;
    color: keyof typeof colors;
  }

  const { href, name, color }: ServiceLinkProps = $props();
</script>

<a
  {href}
  class="block h-20 min-w-36 not-hover:not-focus:*:opacity-80 hover:*:-translate-y-1 hover:*:shadow-xl focus:outline-none focus:*:ring-3 focus:*:ring-offset-3 sm:h-24"
>
  <div
    class="flex size-full flex-col items-center justify-center rounded-3xl border-2 ring-current transition-all duration-400"
    style:background-color={colors[color][50]}
    style:border-color={colors[color][300]}
    style:color={colors[color][500]}
  >
    <p class="text-center text-xl font-bold text-{color}-600">{name}</p>
  </div>
</a>
