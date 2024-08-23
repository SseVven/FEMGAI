<script setup>
import { ref } from 'vue';
import EventBus from './assets/common/event-bus';
const data = ref({
    WorldPosition: [0, 0, 0],
    DisplayPosition: [0, 0, 0],
});

EventBus.on('mosemovde-info', (e) => {
    // console.log(e);

    for (let i = 0; i < 3; i++)
        data.value.WorldPosition[i] = parseFloat(e.worldPosition[i].toFixed(2));
    // data.value.DisplayPosition[0] = e.displayPosition[0];
    // data.value.DisplayPosition[1] = e.displayPosition[1];
})

</script>
<template>
    <footer>
        <div>
            <a-tag color="processing">WorldPosition:{{ data.WorldPosition }}</a-tag>
            <!-- <a-tag color="success">DisplayPosition:{{ data.DisplayPosition }}</a-tag> -->
            <!-- <a-tag color="error">error</a-tag> -->
            <!-- <a-tag color="warning">warning</a-tag> -->
            <!-- <a-tag color="default">default</a-tag> -->
        </div>
    </footer>
</template>



<style scoped>
footer {}
</style>