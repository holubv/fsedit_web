<template>
    <div class="wrapper">
        <form @submit.prevent="onSubmit" :class="{processing}">

            <div>
                <label for="email">{{ $t('auth.email') }}</label>
                <div :class="['input-state', emailState]">
                    <input v-model="email" type="email" name="email" id="email"
                           maxlength="64" autofocus pattern="[!-?A-~]+@[!-?A-~]+" required
                           @input="onEmailChange">
                </div>
            </div>

            <div>
                <label for="password">{{ $t('auth.password') }}</label>
                <div :class="['input-state', {success: register && !!password}]">
                    <input v-model="password" type="password" name="password" id="password" required>
                </div>
            </div>

            <div>
                <transition name="component-fade">
                    <div v-if="register">
                        <label for="password-again">{{ $t('auth.passwordAgain') }}</label>

                        <div :class="['input-state', inputPassAgainClass]">
                            <input v-model="passwordAgain"
                                   type="password"
                                   name="passwordAgain"
                                   id="password-again"
                                   required>
                        </div>

                        <vue-recaptcha class="recaptcha"
                                       sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                       :theme="$fsedit.theme"
                                       @verify="onCaptchaVerified"
                        ></vue-recaptcha>
                    </div>
                </transition>
            </div>

            <a href="#" @click.prevent="morph">{{$t('auth.switch.' + formType)}}</a>

            <button class="btn primary submit"
                    type="submit"
                    :disabled="processing || (register && (!emailValid || !passwordMatch || !captchaKey))">
                <i v-if="processing" class="fas fa-spinner fa-spin"></i>
                <span v-else>{{$t('auth.btn.' + formType)}}</span>
            </button>

            <span v-if="error" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {{ $t(error) }}
            </span>

        </form>

        <!--<div v-if="processing" class="overlay" ref="overlay"></div>-->
    </div>
</template>

<script>

    import VueRecaptcha from 'vue-recaptcha'
    import debounce from 'es6-promise-debounce'

    export default {
        name: 'Login',
        data() {
            return {
                email: '',
                password: '',
                passwordAgain: '',
                register: false,
                recaptchaLoaded: false,
                captchaKey: null,
                processing: false,
                error: null,
                emailState: '' //{success: register && emailValid, error: email && !emailValid, warn: true}
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
            },
            userExists(email) {
                if (email === undefined) {
                    email = this.email;
                }

                return this.$api({
                    url: '/users/exists',
                    method: 'post',
                    params: {
                        email: email
                    },
                    validateStatus(status) {
                        return (status >= 200 && status < 300) || status === 409;
                    },
                }).then(rs => {
                    return rs.status === 409;
                });
            },
            debounced: debounce(() => Promise.resolve(null), 1000),
            onEmailChange() {
                if (!this.email) {
                    this.emailState = '';
                    return;
                }
                if (!this.emailValid) {
                    this.emailState = 'error';
                    return;
                }
                if (!this.register) {
                    return;
                }
                this.emailState = '';
                this.debounced()
                    .then(() => this.userExists())
                    .then(exists => {
                        if (exists) {
                            this.emailState = 'warn';
                        } else {
                            this.emailState = 'success';
                        }
                    });
            },
            onCaptchaVerified(key) {
                this.captchaKey = key;
            },
            onSubmit() {
                if (this.processing) {
                    return;
                }
                this.processing = true;

                let data = new FormData();
                data.append('email', this.email);
                data.append('password', this.password);
                if (this.captchaKey) {
                    data.append('captcha', this.captchaKey);
                }

                this.$api.post('/users/' + this.formType, data)
                    .then(rs => {
                        let token = rs.data.token;
                        if (!token) {
                            throw {};
                        }
                        this.$fsedit.token = token;
                        this.$fsedit.user = {
                            email: rs.data.email
                        };

                        let ws = this.$route.query.ws;
                        if (ws) {
                            this.$router.push({name: 'show', params: {workspace: ws}});
                        } else {
                            this.$router.push({name: 'index'});
                        }
                    })
                    .catch(err => {
                        if (err.response) {
                            let map = {
                                403: 'err.auth.wrongCredentials',
                                409: 'err.auth.alreadyRegistered',
                                500: 'err.server'
                            };
                            this.error = map[err.response.status] || 'err.unknown';
                        } else {
                            this.error = 'err.net';
                        }
                    })
                    .then(() => {
                        this.processing = false;
                    })
            }
        },
        computed: {
            inputPassAgainClass() {
                return {
                    success: this.password && this.password === this.passwordAgain,
                    error: this.password !== this.passwordAgain
                }
            },
            formType() {
                return this.register ? 'register' : 'login';
            },
            emailValid() {
                return this.email && this.email.match(/^[!-?A-~]+@[!-?A-~]+$/);
            },
            passwordMatch() {
                return this.password && this.password === this.passwordAgain;
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
        margin: 10px auto 10px 1px;
        width: 300px;
        height: (78/304) * 300px;

        & > div {
            .transform(scale(300 / 304) translateZ(0));
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
        position: relative;
    }

    form {
        .theme({ background-color: @content-background-color; border-color: darken(@background-color, 20%); });
        border: 1px solid;

        width: 300px;
        margin: auto;
        padding: 16px 12px;
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }

    .input-state {
        display: block;
        width: 300px;
    }

    button {
        display: block;
        width: 300px;

        & .fas {
            font-size: 15px;
        }
    }

    label {
        display: block;
    }

    .error-message {
        .theme({ color: @danger-color });
    }

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .2s ease;
    }

    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>