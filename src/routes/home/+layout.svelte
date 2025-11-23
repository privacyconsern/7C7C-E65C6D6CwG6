<script lang="ts">
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>
<nav>
    <a href="/">main</a>
	<a href="/register">register</a>
    <a href="/login">login</a>
    <a href="/restaurants">restrants</a>
</nav>
{@render children()}