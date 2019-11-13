<template>
    <div class="login-container">
        <transition name="fade" mode="out-in">
            <el-card class="login-main" v-if="isLogin" key="login">
                <h2>管理系统登录</h2>
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" style="padding: 25px;">
                    <el-form-item prop="loginAccount">
                        <el-input placeholder="账号" v-model="loginForm.loginAccount" class="login-input">
                            <i slot="prepend" class="el-icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="loginPassword">
                        <el-input placeholder="密码" v-model="loginForm.loginPassword" show-password>
                            <i slot="prepend" class="el-icon-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%" @click="onLogin">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-link :underline="false" style="font-size: 15px;" @click.prevent="isLogin = false">还没有账号？创建一个！</el-link>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="login-main" v-else key="register">
                <h2>注册</h2>
                <el-form ref="regForm" :model="regForm" :rules="regRules" style="padding: 25px;">
                    <el-form-item prop="regAccount">
                        <el-input placeholder="账号" v-model="regForm.regAccount" class="login-input">
                            <i slot="prepend" class="el-icon-user"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="regPassword">
                        <el-input placeholder="密码" v-model="regForm.regPassword" show-password>
                            <i slot="prepend" class="el-icon-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="regFirmPassword">
                        <el-input placeholder="确认密码" v-model="regForm.regFirmPassword" show-password>
                            <i slot="prepend" class="el-icon-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="regCitizenID">
                        <el-input placeholder="身份证号" v-model="regForm.regCitizenID">
                            <i slot="prepend" class="el-icon-bank-card"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="regID" :error="regIdError">
                        <el-input placeholder="凭证" v-model="regForm.regID">
                            <el-select v-model="regForm.regType" slot="prepend" placeholder="注册方式" style="width: 110px;">
                                <el-option label="邮箱" value="0"></el-option>
                                <el-option label="手机号码" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="regCode">
                        <el-input placeholder="验证码" v-model="regForm.regCode">
                            <el-button slot="append" icon="el-icon-s-promotion" @click="onSendCode" :disabled="codeDisabled">{{codeMessage}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%" @click="onRegister">注册</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="normal" style="width: 100%" @click="isLogin = true">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    loginAccount: '',
                    loginPassword: '',
                },
                regForm: {
                    regAccount: '',
                    regPassword: '',
                    regFirmPassword: '',
                    regCitizenID: '',
                    regType: '',
                    //注册凭证 邮件或者手机号码
                    regID: '',
                    regCode: '',
                },
                loginRules: {
                    loginAccount: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    loginPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                regRules: {
                    regAccount: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    regPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    regFirmPassword: [
                        { required: true, message: '请确认密码', trigger: 'blur' },
                        { validator: this.firmPassword, trigger: 'blur' }
                    ],
                    regCitizenID: [
                        { required: true, message: '请输入身份证号码', trigger: 'blur' },
                        { validator: this.validID, trigger: 'blur' }
                    ],
                    regID: [
                        { required: true, message: '请输入验证码凭证', trigger: 'blur' },
                    ],
                    regCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                    ],
                },
                isLogin: true,
                count :60,
                codeMessage: '发送验证码',
                codeDisabled: false,
                regIdError: '',
            }
        },
        methods: {
            // 身份证验证
            async validID(rule,value,callback)
            {
                // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(value)) {
                    callback()
                } else {
                    callback(new Error('身份证号码不正确'))
                }
            },
            //确认密码验证
            async firmPassword(rule,value,callback)
            {
                if (value === this.regForm.regPassword) {
                    callback()
                } else {
                    callback(new Error('确认密码错误'))
                }
            },
            onLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/login', this.qs.stringify({
                            userID: this.loginForm.loginAccount,
                            password: this.bcrypt.hashSync(this.loginForm.loginPassword)
                        }))
                            .then((response) => {
                                console.log(response);
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    } else {
                        return false;
                    }
                });
            },
            onRegister(){
                this.$refs.regForm.validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/Register', this.qs.parse({
                            id: this.regForm.regAccount,
                            password: this.regForm.regPassword,
                            firmPassword: this.regForm.regFirmPassword,
                            code: this.regForm.regCode,
                            citizenID: this.regForm.regCitizenID,
                            registerType: this.regForm.regType
                        }))
                            .then((response) => {
                                console.log(response);
                                this.$refs.regForm.resetFields();
                                this.regForm = {};
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    } else {
                        return false;
                    }
                });
            },
            async onSendCode() {
                try {
                    if(this.regForm.regID === ''){
                        this.regIdError = '请输入验证码凭证';
                    }else{
                        let response = await this.sendCode();
                        console.log(response);
                        if(response.status === 200){
                            //设置60s定时器
                            this.countDown();
                        }
                    }
                }catch (error) {
                    this.$message({
                        type: 'error',
                        message: error.response.data.content
                    })
                }
            },
            sendCode(){
                let data = {};
                let api = '';
                switch (this.regForm.regType) {
                    case '0':
                        data = {
                            email: this.regForm.regID
                        };
                        api = '/api/sendEmailCode';
                        break;
                    case '1':
                        data = {
                            phoneNum: this.regForm.regID
                        };
                        api = '/api/sendSmsCode';
                        break;
                    default:
                        return Promise.reject({
                            response: {
                                data: {
                                    content: '未选择方式'
                                }
                            }
                        });
                }
                return this.axios.post(api, this.qs.stringify(data));
            },
            //60s计时器
            countDown(){
                let _this = this;
                if(this.count === 0){
                    //改变状态
                    this.count = 60;
                    this.codeMessage = '发送验证码';
                    this.codeDisabled = false;
                    return;
                } else{
                    this.count--;
                    this.codeDisabled = true;
                    this.codeMessage = this.count + "s后重新发送";
                }
                setTimeout(function () {
                    _this.countDown();
                }, 1000)
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .login-main{
        width: 500px;
        border-radius: 4px;
        box-shadow: 0 0 25px #cac6c6;
        margin: 250px auto;
        text-align: center;
    }
    .login-container{
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(-135deg, #fff, #4158d0);
    }
</style>
