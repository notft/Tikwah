<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index"
    import {User} from "lucide-svelte"

    const {images}: {images: string[]} = $props();
</script>

<div class="grid root w-11">
    {#each images.slice(0, 2) as image, i}
        <Avatar.Root class="h-7 w-7">
            <Avatar.Image src={image}/>
            <Avatar.Fallback>
                <User size={16}/>
            </Avatar.Fallback>
        </Avatar.Root>
    {/each}
    {#if images.length - 2 > 0}
        <Avatar.Root class="h-7 w-7">
            <Avatar.Fallback class="text-sm">
                +{images.length - 2}
            </Avatar.Fallback>
        </Avatar.Root>
    {/if}
</div>

<style>
    .root{
        grid-template-columns: repeat(auto-fit,  minmax(10px, max-content));
    }
</style>
