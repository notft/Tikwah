<script lang="ts">
    import { FolderGit2, CircleArrowOutUpRight } from "lucide-svelte";
    import AvatarStack from "./AvatarStack.svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { spring } from "svelte/motion";
    import { quintOut } from "svelte/easing";

    const { title, uptime } = $props();

    let isHovered = $state(false);

    const scaleSpring = spring(
        { x: 1, y: 1 },
        {
            stiffness: 0.1,
            damping: 0.5,
        },
    );

    $effect(() => {
        if (isHovered) {
            scaleSpring.set({ x: 1.02, y: 1.02 });
        } else {
            scaleSpring.set({ x: 1, y: 1 });
        }
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="max-w-48 w-[48%] rounded-3xl bg-[#d1d8d9] flex flex-col gap-2 p-4 cursor-pointer transform-gpu transition-all duration-300"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    style:transform="scale({$scaleSpring.x}, {$scaleSpring.y})"
    in:fly={{ y: 20, duration: 600, easing: quintOut }}
    out:fade
>
    <div
        class="flex flex-row w-full justify-between items-center"
        in:fade={{ delay: 200, duration: 400 }}
    >
        <div
            class="w-8 aspect-square rounded-full bg-black flex justify-center items-center transition-all duration-300 {isHovered
                ? 'rotate-12'
                : ''}"
        >
            <FolderGit2
                class="stroke-white transition-all duration-300 {isHovered
                    ? 'scale-110'
                    : ''}"
                size={14}
            />
        </div>
        <CircleArrowOutUpRight
            class="text-[#686868] transition-all duration-300 {isHovered
                ? 'translate-x-1 -translate-y-0.5'
                : ''}"
            size={16}
        />
    </div>

    <h1
        class="text-xl transition-all duration-300 {isHovered
            ? 'translate-x-1'
            : ''}"
        in:fade={{ delay: 400, duration: 400 }}
    >
        {title}
    </h1>

    <div
        class="flex flex-row justify-between items-center p-2 rounded-full bg-[#AFB9BB] w-full transition-all duration-300 {isHovered
            ? 'bg-[#9fa9ab]'
            : ''}"
        in:scale={{ delay: 600, duration: 400, easing: quintOut }}
    >
        <AvatarStack
            images={[
                "https://images.squarespace-cdn.com/content/v1/5bfc8dbab40b9d7dd9054f41/1543422989717-ZGDS44WYKN4XYXDE20TB/Randy+Krum+Profile+Photo+square.jpg",
                "https://shiftart.com/wp-content/uploads/2017/04/RC-Profile-Square.jpg",
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.PPbvizK9tByLNQ8V7lrEpQHaHa%26pid%3DApi&f=1&ipt=6d9313da78616cce8bec01fbd96331da1c001e7fa986fae17ce95bbcc3c4fb0c&ipo=images",
            ]}
        />
        <p
            class="text-[#6d6d6d] text-sm"
            in:fade={{ delay: 800, duration: 400 }}
        >
            {uptime}
        </p>
    </div>
</div>
