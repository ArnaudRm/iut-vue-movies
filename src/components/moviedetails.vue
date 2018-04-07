<template>
    <div>Film {{ $route.params.id }}</div>
</template>

<script>
    export default {
        props: {
            movie: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
            };
        },
        methods: {

        },
    };
</script>

<style>

</style>
