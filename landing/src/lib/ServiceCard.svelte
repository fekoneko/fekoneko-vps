<script lang="ts">
  import colors from 'tailwindcss/colors';

  export let href: string;
  export let name: string;
  export let color: keyof typeof colors;
</script>

<a
  {href}
  class="focus:*:ring-3 focus:*:ring-offset-3 not-hover:not-focus:*:opacity-80 block h-20 min-w-36 hover:*:-translate-y-1 hover:*:shadow-xl focus:outline-none sm:h-28"
>
  <div
    class="shadow-current/15 duration-400 flex size-full flex-col items-center justify-center rounded-3xl border-2 ring-current transition-all"
    style:background-color={colors[color][50]}
    style:border-color={colors[color][300]}
    style:color={colors[color][500]}
  >
    <p class="text-center text-xl font-bold text-{color}-600">{name}</p>
  </div>
</a>
