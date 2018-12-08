<template>
    <div class="wrapper">
        <form>

            <div class="form-example">
                <label for="email">{{ $t('auth.email') }}</label>
                <input v-model="email" type="email" name="email" id="email" required>
            </div>

            <div class="form-example">
                <label for="password">{{ $t('auth.password') }}</label>
                <input v-model="password" type="password" name="password" id="password" required>
            </div>

            <div class="form-example">
                <transition name="component-fade">
                    <div v-if="register">
                        <label for="password-again">{{ $t('auth.passwordAgain') }}</label>
                        <input v-model="passwordAgain" type="password" name="passwordAgain" id="password-again"
                               :class="{['input-error']: password !== passwordAgain}">
                        <vue-recaptcha class="recaptcha" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"/>
                    </div>
                </transition>
            </div>

            <a href="#" @click.prevent="morph">{{$t(i18nSwitchKey)}}</a>

            <button class="btn primary submit" type="submit">Login</button>

            <!--

            <input v-model="email" type="email" :placeholder="$t('auth.form.email')">
                    <input v-model="password" type="password" :placeholder="$t('auth.form.password')">

                    <transition name="component-fade">
                        <div v-if="register">
                            <input v-model="passwordAgain" type="password"
                                   :class="{['input-error']: password !== passwordAgain}"
                                   :placeholder="$t('auth.form.password2')">
                            <vue-recaptcha :class="$style.recaptcha" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"/>
                        </div>
                    </transition>

                    <button :class="['btn', $style.submitBtn]" v-on:click.prevent>{{ $t('global.btn.' + authType) }}</button>

            -->
        </form>
    </div>
</template>

<script>

    import VueRecaptcha from 'vue-recaptcha'

    export default {
        name: 'Login',
        data() {
            return {
                email: '',
                password: '',
                passwordAgain: '',
                register: false,
                recaptchaLoaded: false
            }
        },
        methods: {
            morph() {
                this.register = !this.register;
                if (this.register) {
                    this.loadRecaptcha();
                }
            },
            loadRecaptcha() {
                if (!this.recaptchaLoaded) {
                    if (window.document.getElementById('g-recaptcha-script')) {
                        this.recaptchaLoaded = true;
                        return;
                    }
                    let script = window.document.createElement('script');
                    script.setAttribute('id', 'g-recaptcha-script');
                    script.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit');
                    window.document.head.appendChild(script);
                    this.recaptchaLoaded = true;
                }
            }
        },
        computed: {
            i18nSwitchKey() {
                return 'auth.switch.' + (this.register ? 'login' : 'register');
            }
        },
        components: {
            VueRecaptcha
        },
    }
</script>

<style lang="less">
    @import "../theme/global";

    .recaptcha {
        display: block;
        margin: 10px auto 10px;
        width: 300px;
        height: (78/304) * 300px;

        & > div {
            .transform(scale(302/304));
            .transform-origin(0 0);
        }

        /*@media (max-width: 420 + 40px) {
            width: 206px;
            & > div {
                .transform(scale(207/304));
            }
        }*/
    }
</style>

<style scoped lang="less">
    @import "../theme/global";

    .wrapper {
        margin-top: 18px;
    }

    form {
        .theme({ background-color: @content-background-color; border-color: darken(@background-color, 20%); });
        border: 1px solid;

        width: 300px;
        margin: auto;
        padding: 16px 12px;
    }

    button {
        display: block;
        width: 300px;
    }

    label {
        display: block;
    }

    input {
        display: block;
        width: 100%;
    }

    .input-error {
        background-color: red;
    }

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .2s ease;
    }

    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>