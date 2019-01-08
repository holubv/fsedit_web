<template>
    <div :class="['split-panel', 'display-' + side]">
        <div class="side">
            <div class="side-head" ref="sideHead">
                <slot name="side-head"></slot>
            </div>
            <div class="side-body" :style="sideBodyStyle">
                <slot name="side"></slot>
            </div>
            <div class="side-foot" ref="sideFoot">
                <slot name="side-foot"></slot>

                <div class="footer-placeholder"></div>
            </div>
            <div class="control">
                <div class="control-switch" @click.prevent="$emit('switch')">
                    <i v-if="side === 'min' || side === 'small'" class="fas fa-chevron-right"></i>
                    <i v-else class="fas fa-chevron-left"></i>
                </div>
            </div>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SplitPanel',
        props: {
            side: {
                type: String,
                default: 'normal'
            }
        },
        data() {
            return {
                sideBodyStyle: {
                    height: '100%'
                }
            }
        },
        methods: {
            computeSideBodyHeight() {
                let head = this.$refs.sideHead.clientHeight;
                let foot = this.$refs.sideFoot.clientHeight;
                this.sideBodyStyle.height = 'calc(100% - ' + head + 'px - ' + foot + 'px)';
            }
        },
        watch: {
            side() {
                this.$nextTick(() => {
                    this.computeSideBodyHeight();
                });
            }
        },
        // mounted() {
        //     this.computeSideBodyHeight();
        //     window.addEventListener('resize', this.computeSideBodyHeight);
        // },
        // beforeDestroy() {
        //     console.log('before destroy SplitPanel');
        //     window.removeEventListener('resize', this.computeSideBodyHeight);
        // }
    }
</script>

<style lang="less" scoped>
    @import "../theme/global";

    @display-small-side-width: 56px;
    @control-height: 60px;
    @control-width: 30px;

    .split-panel {
        position: relative;
        width: 100%;
        overflow-x: hidden;
    }

    .side {
        display: inline-block;
        position: relative;
        height: calc(100vh - @nav-height - 1px);
        vertical-align: top;
        overflow: hidden;
        border-right: 1px solid;
        .theme({ background-color: @content-background-color; border-color: darken(@background-color, 20%); });
    }

    .side-body {
        overflow: auto;
        position: relative;
    }

    .side-foot {
        position: absolute;
        width: 100%;
        bottom: 0;

        & .footer-placeholder {
            width: 100%;
            height: @foot-height;
        }
    }

    .content {
        display: inline-block;
    }

    .control {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 0;

        /*@media (max-width: 720px) {*/
            /*width: 60px;*/
        /*}*/

        & .control-switch {
            position: absolute;
            top: 50%;
            margin-top: -(@control-height / 2);
            right: 0;

            height: @control-height;
            width: @control-width;

            .theme({ background-color: fade(@color, 10%); color: @color-invert; });

            cursor: pointer;

            & i {
                line-height: @control-height;
                width: 100%;
                text-align: center;
            }
        }
    }

    .display-none {
        & .side {
            display: none;
        }
        & .content {
            width: 100%;
        }
    }

    .display-min {
        & .side {
            width: @control-width;

            & .side-head, & .side-body, & .side-foot {
                display: none;
            }
        }
        & .content {
            width: calc(100% - @control-width - 1px);
        }
    }

    .display-small {
        & .side {
            width: @display-small-side-width;

            & .side-body {
                display: none;
            }
        }
        & .content {
            width: calc(100% - @display-small-side-width - 1px);
        }
    }

    .display-normal {
        & .side {
            width: calc(20% - 1px);
        }
        & .content {
            width: 80%;
        }
    }

    .display-max {
        & .side {
            width: calc(95% - 1px);
        }
        & .content {
            width: 5%;
        }
    }

    .display-full {
        & .side {
            width: 100%;
        }
        & .content {
            display: none;
        }
    }

</style>