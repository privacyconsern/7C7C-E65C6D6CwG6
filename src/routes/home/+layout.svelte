<script lang="ts">
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>
<nav>
    <a href="/">home</a>
	<a href="/register">register</a>
</nav>
{@render children()}