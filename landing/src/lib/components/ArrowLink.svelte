<script lang="ts">
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte';

  export interface ArrowLinkProps {
    href: string;
    label?: string;
    direction?: 'left' | 'right';
  }

  const { href, label, direction = 'left' }: ArrowLinkProps = $props();
</script>

<a
  {href}
  class={[
    'xs:gap-2 -mx-44 -my-28 flex items-center gap-1 rounded-full px-44 py-28 text-neutral-400 transition-colors duration-400 hover:text-neutral-600 focus:text-neutral-600 focus:outline-none',
    direction === 'left' && '*:[svg]:rotate-180',
    direction === 'left' && 'hover:*:[svg]:-translate-x-2 focus:*:[svg]:-translate-x-2',
    direction === 'right' && 'hover:*:[svg]:translate-x-2 focus:*:[svg]:translate-x-2',
  ]}
>
  {#if label}
    <p class={['xs:text-2xl mb-1 text-xl', direction === 'left' && 'order-1']}>
      {label}
    </p>
  {/if}
  <ArrowRightIcon class="xs:size-14 size-12 opacity-60 transition-transform duration-400" />
</a>
