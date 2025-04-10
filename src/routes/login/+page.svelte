<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { fade, fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    const googleAuthUrl = $page.data.authUrl;

    let isDark = false;
    let mouseX = 0;
    let mouseY = 0;
    let leftContainer: HTMLElement;
    let currentImageIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;
    let isLoaded = false;
    let initialLoad = true;  // New flag for initial load state

    const backgroundImages = [
        "/images/statues.jpg",
        "/images/modern-studio.webp"
    ];

    function toggleTheme() {
        isDark = !isDark;
        document.documentElement.classList.toggle("dark");
    }
    function handleSignupRedirect() {
    goto('/signup');
}
    function handleMouseMove(event: MouseEvent) {
        if (!leftContainer) return;
        const rect = leftContainer.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 100;
        mouseY = ((event.clientY - rect.top) / rect.height) * 100;
    }

    function switchImage() {
        initialLoad = false;  // Clear initial load state
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    }

    onMount(() => {
        isDark = false;
        setTimeout(() => {
            isLoaded = true;
        }, 100);
        intervalId = setInterval(switchImage, 5000);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
    });
</script>

{#if isLoaded}
<div 
    class="min-h-screen w-full relative overflow-hidden" 
    class:dark={isDark}
    in:fade={{ duration: 300 }}
>
    <!-- Content Grid -->
    <div class="min-h-screen grid lg:grid-cols-2 grid-cols-1">
        <!-- Left Side - Branding -->
        <div
            class="relative lg:min-h-screen min-h-[50vh]"
            bind:this={leftContainer}
            on:mousemove={handleMouseMove}
            role="presentation"
        >
            <!-- Background Container -->
            <div class="absolute inset-0">
                {#each backgroundImages as image, i}
                    <div
                        class="absolute inset-0 transition-all duration-1000"
                        style:opacity={currentImageIndex === i ? "1" : "0"}
                    >
                        <img
                            src={image}
                            alt="Background"
                            class="w-full h-full object-cover transition-transform duration-1000"
                            style="transform: scale({initialLoad || currentImageIndex === i ? '1' : '1.05'})"
                        />
                    </div>
                {/each}
            </div>

            <!-- Content -->
            <div
                class="relative z-30 flex flex-col justify-center items-center h-full p-4 lg:p-8"
                in:fly={{ y: 20, duration: 800, delay: 300 }}
            >
                <div class="max-w-2xl mx-auto space-y-4 lg:space-y-6">
                    <h1
                        class="text-white/80 text-xl lg:text-2xl text-center hero-text font-[SH AD Grotesk]"
                        in:fly={{ y: 20, duration: 800, delay: 500 }}
                    >
                        Sessions that works for you,<br /> not against you
                    </h1>
                    <div
                        class="flex justify-between items-center w-full max-w-xl mx-auto mb-8 lg:mb-16 space-x-4 lg:space-x-6"
                        in:fly={{ y: 20, duration: 800, delay: 700 }}
                    >
                        <span class="text-white/80 w-24 lg:w-56 text-lg lg:text-2xl hero-text text-right font-sh-grotesk">
                            Therapy made simple
                        </span>
                        <div class="text-[40px] lg:text-[80px] text-white m-0 font-bold animate-pulse">
                            桜
                        </div>
                        <span class="text-white/80 w-24 lg:w-56 text-lg lg:text-2xl hero-text text-left font-sh-grotesk">
                            For the needy
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Login Form -->
        <div
            class="flex items-center justify-center p-6 lg:p-8 bg-white dark:bg-[#0E0E0C]"
            in:fly={{ x: 20, duration: 800 }}
        >
            <div class="w-full max-w-md space-y-6 lg:space-y-8 min-w-[280px] px-4">
                <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
                    <h2 class="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                        Login to Tikwah
                    </h2>
                    <p class="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                        You can login or sign up here with multiple different client options
                    </p>
                </div>

                <div class="space-y-4" in:fly={{ y: 20, duration: 800, delay: 400 }}>
                    <!-- Social Logins -->
                    <a href={googleAuthUrl}>
                        <button class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 p-2.5 lg:p-3 rounded-lg transition-all duration-300 shadow-sm dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white text-sm lg:text-base">
                            <span class="flex items-center justify-center gap-3">
                                <img src="/icons/google.svg" alt="Google" class="w-5 h-5 dark:invert" />
                                Login with Google
                            </span>
                        </button>
                    </a>

                    <div class="relative py-2 lg:py-4">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white dark:bg-[#0E0E0C] text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <!-- Email Form -->
                    <form class="space-y-4 lg:space-y-6" method="POST" action="?/login">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Login
                        </button>
                    </form>
                    <div class="text-center pt-2">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button
                                on:click={handleSignupRedirect}
                                class="text-black dark:text-white hover:underline font-medium"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Theme Toggle -->
    <button
        class="absolute top-4 right-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-[#0E0E0C] dark:border dark:border-gray-900 text-gray-900 dark:text-white shadow-lg"
        on:click={toggleTheme}
        in:fade={{ duration: 800, delay: 1000 }}
    >
        {#if isDark}
            <img src="/icons/moon.svg" alt="Dark mode" class="w-5 h-5" />
        {:else}
            <img src="/icons/sun.svg" alt="Light mode" class="w-5 h-5" />
        {/if}
    </button>
</div>
{:else}
<div class="min-h-screen w-full bg-black"></div>
{/if}

<style>
    :global(.dark) {
        color-scheme: dark;
    }

    .hero-text {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
    }

    .animate-pulse {
        animation: pulse 3s infinite;
    }
</style>