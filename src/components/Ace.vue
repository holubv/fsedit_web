<template>
    <div style="width: 100%; height: 100%;"></div>
</template>

<script>
    import * as ace from 'brace';
    import 'brace/ext/modelist';
    //import 'brace/ext/searchbox';
    import 'brace/ext/language_tools';
    import '@/theme/editor/darkula.js';
    import '@/theme/editor/idea.js';

    export default {
        name: 'Ace',
        props: {
            value: String,
            lang: String,
            darkTheme: Boolean,
            options: Object
        },
        data: function () {
            return {
                editor: null,
                contentBackup: '',
                modes: null
            }
        },
        methods: {
            changeTheme(dark) {
                this.editor.setTheme('ace/theme/' + (dark ? 'darkula' : 'idea'));
            },
            changeLanguage(lang) {
                let editor = this.editor;
                import(/* webpackChunkName: "editor/lang/[request]" */ `brace/mode/${lang}`).then(msgs => {
                    editor.getSession().setMode('ace/mode/' + lang)
                });
            }
        },
        watch: {
            value: function (val) {
                if (this.contentBackup !== val) {
                    this.editor.setValue(val, 1);
                    this.contentBackup = val;
                }
            },
            darkTheme: function (dark) {
                this.changeTheme(dark);
            },
            lang: function (lang) {
                this.changeLanguage(lang);
            },
            options: function (options) {
                this.editor.setOptions(options);
            }
        },
        beforeDestroy: function () {
            this.editor.destroy();
            this.editor.container.remove();
        },
        mounted: function () {
            let _this = this;
            let lang = this.lang || 'text';

            this.editor = ace.edit(this.$el);
            //this.$emit('init', this.editor);

            this.editor.$blockScrolling = Infinity;

            this.changeTheme(this.darkTheme);
            this.changeLanguage(lang);

            this.editor.setValue(this.value, 1);
            this.contentBackup = this.value;

            this.editor.on('change', function () {
                let content = _this.editor.getValue();
                _this.$emit('input', content);
                _this.contentBackup = content;
            });

            // if (this.options) {
            //     this.editor.setOptions(this.options);
            // }
            this.editor.setOptions({
                useSoftTabs: true,
                highlightSelectedWord: true,
                printMarginColumn: 120,
                showFoldWidgets: false,
                showInvisibles: false,
                tooltipFollowsMouse: false,
                animatedScroll: false,
                vScrollBarAlwaysVisible: false,
                fixedWidthGutter: false,
                dragEnabled: false,
                useWorker: false,
                //theme: 'ace/theme/intellij'
            });
            this.editor.focus();

            this.modes = ace.acequire('ace/ext/modelist');
        }
    }
</script>

<style lang="less">

</style>