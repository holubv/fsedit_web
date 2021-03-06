<template>
    <div style="width: 100%; height: 100%;"
         :class="{'ace-darkula': this.darkTheme, 'ace_dark': this.darkTheme, 'ace-idea': !this.darkTheme}">

        <div style="width: 100%; height: 100%;" class="ace_editor" ref="aceDiv"></div>
    </div>
</template>

<script>
    import '../theme/editor/style/ace-snippet-marker.css';
    import '../theme/editor/style/ace-tm.css';
    import '../theme/editor/style/ace-editor.css';
    import '../theme/editor/style/autocompletion.css';
    import '../theme/editor/style/error-widget.css';

    import * as ace from 'brace';
    import 'brace/ext/modelist';
    //import 'brace/ext/searchbox';
    import 'brace/ext/language_tools';
    import '@/theme/editor/darkula.js';
    import '@/theme/editor/idea.js';

    import '../theme/editor/darkula.css'
    import '../theme/editor/idea.css'

    export default {
        name: 'Ace',
        props: {
            value: String,
            darkTheme: Boolean,
            filename: String,
            editable: Boolean
        },
        data: function () {
            return {
                /** @var {?AceAjax.Editor} editor */
                editor: null,
                contentBackup: '',
                modes: null,
                options: {
                    useSoftTabs: true,
                    highlightSelectedWord: true,
                    printMarginColumn: 120,
                    showFoldWidgets: false,
                    showInvisibles: false,
                    tooltipFollowsMouse: false,
                    animatedScroll: false,
                    vScrollBarAlwaysVisible: false,
                    fixedWidthGutter: true,
                    dragEnabled: false,
                    useWorker: false,
                    readOnly: false,
                }
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
            value(val) {
                if (this.contentBackup !== val) {
                    this.editor.setValue(val, 1);
                    this.contentBackup = val;
                }
            },
            darkTheme(dark) {
                this.changeTheme(dark);
            },
            filename(filename) {
                if (!filename) {
                    this.changeLanguage('text');
                    return;
                }
                //console.log(this.modes);
                let mode = this.modes.getModeForPath(filename);
                if (mode) {
                    mode = mode.name;
                } else {
                    mode = 'text';
                }
                this.changeLanguage(mode);
            },
            editable(editable) {
                this.options.readonly = !editable;
                this.editor.setOption('readOnly', !editable);
            },
            options(options) {
                this.editor.setOptions(options);
            }
        },
        beforeDestroy: function () {
            this.editor.destroy();
            this.editor.container.remove();
        },
        mounted: function () {
            let _this = this;

            this.editor = ace.edit(this.$refs.aceDiv);
            //this.$emit('init', this.editor);

            this.editor.$blockScrolling = Infinity;

            this.changeTheme(this.darkTheme);
            this.changeLanguage('text');

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
            this.editor.setOptions(this.options);
            this.editor.focus();

            this.modes = ace.acequire('ace/ext/modelist');

            let textInput = window.document.querySelector('.ace_text-input');
            if (textInput) {
                textInput.removeAttribute('autocorrect');
                textInput.removeAttribute('wrap');
                textInput.setAttribute('autocomplete', 'off');
                textInput.setAttribute('autocapitalize', 'none');

                /*
                On android devices keyboard events have always keyCode 229
                this is a simple fix for pressing backspace on line start
                which should normally remove line

                todo does not work as expected, need changes
                */
                let startPos = {};
                textInput.addEventListener('keydown', (e) => {
                    startPos = Object.assign({}, this.editor.getCursorPosition());
                    //console.log('start: ' + startPos.column);
                });
                textInput.addEventListener('keyup', (e) => {
                    let pos = this.editor.getCursorPosition();
                    //console.log('end: ' + pos.column);
                    if (e.which === 229) {
                        if (pos.column === 0 && startPos.column === pos.column && startPos.row === pos.row) {
                            this.editor.execCommand('backspace', {source: 'ace'});
                        }
                    }
                });
            }

            this.$nextTick(() => {
                let gutterLayer = window.document.querySelector('.ace_layer.ace_gutter-layer');
                if (gutterLayer) {
                    gutterLayer.style.height = '100000px';
                }

                let textLayer = window.document.querySelector('.ace_layer.ace_text-layer');
                if (textLayer) {
                    textLayer.style.height = '100000px';
                }
            });
        }
    }
</script>

<style lang="less">

</style>