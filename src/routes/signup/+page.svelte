<script lang="ts">
    import { json, redirect } from "@sveltejs/kit";
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import {goto} from "$app/navigation";

    let isDark = false;
    let mouseX = 0;
    let mouseY = 0;
    let leftContainer: HTMLElement;
    let currentImageIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;
    let isLoaded = false;
    let initialLoad = true;

    // New state management for signup flow
    let currentStep = 1; // 1: Email, 2: OTP, 3: Password
    let email = '';
    let otp = '';
    let password = '';
    let username = '';
    let confirmPassword = '';
    let loading = false;
    let error = '';

    const backgroundImages = [
        "/images/statues.jpg",
        "/images/modern-studio.webp"
    ];

    function toggleTheme() {
        isDark = !isDark;
        document.documentElement.classList.toggle("dark");
    }

    function handleMouseMove(event: MouseEvent) {
        if (!leftContainer) return;
        const rect = leftContainer.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 100;
        mouseY = ((event.clientY - rect.top) / rect.height) * 100;
    }

    function switchImage() {
        initialLoad = false;
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    }

    async function handleEmailSubmit() {
        loading = true;
        error = '';
        try {
            fetch("/auth/otp", {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            })
            currentStep = 2;
        } catch (err) {
            error = 'Failed to send OTP. Please try again.';
        } finally {
            loading = false;
        }
    }

    async function handleOTPVerify() {
        loading = true;
        error = '';
        try {
            const data: {verified: boolean} = await (await fetch(`/auth/otp?otp=${otp}`)).json();
            if(!data.verified){
                throw Error("Invalid OTP");
            }
            currentStep = 3;
        } catch (err) {
            error = 'Invalid OTP. Please try again.';
        } finally {
            loading = false;
        }
    }

    async function handlePasswordSubmit() {
        if (password !== confirmPassword) {
            error = 'Passwords do not match';
            return;
        }
        loading = true;
        error = '';
        try {
            // Simulate API call to create account
            const response = await fetch("/signup", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    otp: otp,
                    username: username,
                    password: password
                })
            });

            if(response.ok){
                goto("/login");
            }
            // Redirect to dashboard or show success
        } catch (err) {
            error = 'Failed to create account. Please try again.';
        } finally {
            loading = false;
        }
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
                            For the Needy
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Signup Form -->
        <div
            class="flex items-center justify-center p-6 lg:p-8 bg-white dark:bg-[#0E0E0C]"
            in:fly={{ x: 20, duration: 800 }}
        >
            <div class="w-full max-w-md space-y-6 lg:space-y-8 min-w-[280px] px-4">
                <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
                    <h2 class="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                    <p class="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                        {#if currentStep === 1}
                            Enter your email to get started
                        {:else if currentStep === 2}
                            Enter the verification code sent to your email
                        {:else}
                            Create a secure password for your account
                        {/if}
                    </p>
                </div>

                <div class="space-y-4" in:fly={{ y: 20, duration: 800, delay: 400 }}>
                    {#if error}
                        <div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    {/if}

                    <!-- Email Step -->
                    {#if currentStep === 1}
                        <form class="space-y-4 lg:space-y-6" on:submit|preventDefault={handleEmailSubmit}>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    bind:value={email}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                disabled={loading}
                            >
                                {#if loading}
                                    <span class="animate-spin">↻</span>
                                {:else}
                                    Continue
                                {/if}
                            </button>
                        </form>
                    {/if}

                    <!-- OTP Step -->
                    {#if currentStep === 2}
                        <form class="space-y-4 lg:space-y-6" on:submit|preventDefault={handleOTPVerify}>
                            <div>
                                <label for="otp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    bind:value={otp}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                    placeholder="Enter verification code"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                disabled={loading}
                            >
                                {#if loading}
                                    <span class="animate-spin">↻</span>
                                {:else}
                                    Verify Code
                                {/if}
                            </button>
                        </form>
                    {/if}

                    <!-- Password Step -->
                    {#if currentStep === 3}
                        <form class="space-y-4 lg:space-y-6" on:submit|preventDefault={handlePasswordSubmit}>
                            <div>
                                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                <input
                                    id="username"
                                    bind:value={username}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                    placeholder="Create a username"
                                    required
                                />
                            </div>
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    bind:value={password}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    bind:value={confirmPassword}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 dark:bg-[#0E0E0C] dark:border dark:border-gray-600 dark:text-white dark:focus:ring-gray-500"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                disabled={loading}
                            >
                                {#if loading}
                                    <span class="animate-spin">↻</span>
                                {:else}
                                    Create Account
                                {/if}
                            </button>
                        </form>
                    {/if}

                    <!-- Login Link -->
                    <div class="text-center text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Already have an account?</span>
                        <a href="/login" class="ml-1 text-black dark:text-white hover:underline">Login here</a>
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