<script lang="ts">
    import Progress from "./ui/progress/progress.svelte";
</script>

<div class="w-full flex flex-row items-center">
    <Progress value={50}/>
    <div class="h-10 border border-[#a9a9a9] border-dashed"></div>
    <Progress value={50}/>
    <div class="h-10 border border-[#a9a9a9] border-dashed"></div>
    <Progress value={50}/>
</div>