<template>

    <transition name="fade">
        <div class="welcome-wrapper">
            <div class="welcome-box">
                <h1>{{ $t('welcome.title') }} <span class="logo no-after">fsEdit|</span></h1>
                <span>{{ $t('welcome.desc') }}</span>
            </div>
        </div>
    </transition>

</template>

<script>
    export default {
        name: 'WelcomeScreen'
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    @box-width: 400px;
    @box-height: 90px;

    .welcome-wrapper {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 99;
        cursor: default;
        user-select: none;
        pointer-events: none;

        width: 100%;
        margin-top: @box-height / -2;
    }

    .welcome-box {
        width: @box-width;
        height: @box-height;

        margin: auto;

        border: 4px dashed;
        border-radius: 4px;

        .theme({ color: fade(@color, 35%); });

        text-align: center;
    }

    h1 {
        margin-top: 0;
    }

    .logo {
        .logo-font(32px);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>