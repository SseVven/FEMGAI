<script setup>
import Components from './components/LeftBar/Components.vue'
import CameraControl from './components/LeftBar/CameraControl.vue'
</script>


<template>
    <nav class="d-flex align-items-start">
        <div class="nav flex-column nav-pills me-3" id="v-pills-tab" style="margin-right: 0 !important;" role="tablist"
            aria-orientation="vertical">
            <button :class="'icon-icon iconfont nav-link active'" id="v-pills-home-tab" data-bs-toggle="pill"
                data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                aria-selected="true"></button>
            <button class="icon-icon_shexiangji iconfont nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile"
                aria-selected="false"></button>
            <button class="icon-lishijilu iconfont nav-link" id="v-pills-history-tab" data-bs-toggle="pill"
                data-bs-target="#v-pills-history" type="button" role="tab" aria-controls="v-pills-history"
                aria-selected="false"></button>
        </div>
        <div class="tab-content" id="v-pills-tabContent">
            <!-- // 组件控制器 -->
            <div class="h_control tab-pane fade show active" id="v-pills-home" role="tabpanel"
                aria-labelledby="v-pills-home-tab" tabindex="0">
                <Components />
            </div>
            <!-- // 视角 -->
            <div class="h_control tab-pane fade" id="v-pills-profile" role="tabpanel"
                aria-labelledby="v-pills-profile-tab" tabindex="0">
                <CameraControl />
            </div>
            <!-- // 历史记录 -->
            <div class="h_control tab-pane fade" id="v-pills-history" role="tabpanel"
                aria-labelledby="v-pills-history-tab" tabindex="0">...</div>
        </div>
    </nav>
</template>


<style scoped>
nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 3px;
}

#v-pills-tabContent {
    flex: 1;
    height: 100%;
    width: 0;
    background-color: #f1f1f1;
}

button {
    --bs-nav-pills-link-active-bg: #f1f1f1;
    border-radius: 0 !important;
}

.h_control {
    width: 100%;
    height: 100%;
}

.left_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 3px;
    padding: 3px;
}

.head_title {
    /* margin: 3px; */
}

section {
    /* margin: 3px; */
}
</style>