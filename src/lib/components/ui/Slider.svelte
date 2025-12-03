<script>
    const cuisines = [
        { name: 'Breakfast', href: '/search?filter=breakfast', isSpecial: false },
        { name: 'Vegetarian', href: '/search?filter=vegetarian', isSpecial: true },
        { name: 'Japanese', href: '/search?filter=japanese', isSpecial: false },
        { name: 'Georgian', href: '/search?filter=georgian', isSpecial: false },
        { name: 'Italian', href: '/search?filter=italian', isSpecial: false },
        { name: 'Local', href: '/search?filter=local', isSpecial: false },
        { name: 'Vegan', href: '/search?filter=vegan', isSpecial: true },
        { name: 'Pizza', href: '/search?filter=pizza', isSpecial: false },
        { name: 'Lunch', href: '/search?filter=lunch', isSpecial: false },
        { name: 'Turkish', href: '/search?filter=turkish', isSpecial: false },
        { name: 'Vietnamese', href: '/search?filter=vietnamese', isSpecial: false },
        { name: 'Dinner', href: '/search?filter=dinner', isSpecial: false },
    ];
    const duplicatedCuisines = [...cuisines, ...cuisines];
</script>
<div class="relative w-full h-22 mt-30 bg-[#2300B0] flex items-center overflow-hidden font-sans text-white">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-5 bg-[#2300B0] flex items-center gap-2 cursor-pointer">
        <h1 id="1" class="text-3xl text-white font-poppins-bold flex items-center justify-center py-4.5">Popular now 🡻</h1>
    </div>
    <div class="flex animate-marquee whitespace-nowrap">
        {#each duplicatedCuisines as cuisine}
            <a
                    href={cuisine.href}
                    class="text-2xl mx-6 transition-transform duration-200 hover:scale-110"
                    class:text-green-400={cuisine.isSpecial}
                    class:font-semibold={cuisine.isSpecial}
                    aria-label={`Find ${cuisine.name} restaurants`}
            >
                {cuisine.name}
            </a>
        {/each}
    </div>
</div>

<style>
    @keyframes marquee {
        0% {
            transform: translateX(0%);
        }
        100% {
            transform: translateX(-50%);
        }
    }
    .animate-marquee {
        animation: marquee 40s linear infinite;
    }
    .animate-marquee:hover {
        transform: translateX(0%);
        animation-play-state: paused;
    }
</style>