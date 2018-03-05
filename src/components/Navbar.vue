<template>
<header class="header" id="app-menu">
        <div class="grid left">
        <div class="logo">
            <a href="/" role="button" target="_self" title="ub.com"><img src="../assets/logo.svg" /></a>
        </div>
        <div class="menu">
            <ul>
                <!--<li><a role="button" href="/#page1"><%- LANG('Home') %></a></li>-->
                <li><a role="button" href="javascript:void(0)" arrow="true">{{$t('nav.project')}}</a>
                    <div class="menu-list">
                        <ul>
                            <!--<li><a role="button" href="/project/overview"><%- LANG('Project overview') %></a></li>-->
                            <li><a role="button" href="javascript:;">{{$t('nav.white_paper')}}</a></li>
                            <!--<li><a role="button" href="/project/features"><%- LANG('Features') %></a></li>-->
                            <li><a role="button" href="javascript:;">{{$t('nav.get_unitedbitcoin')}}</a></li>
                        </ul>
                    </div>
                </li>
                <li><a role="button" class="ecosystem_primary" href="javascript:;">{{$t('nav.ecosystem')}}</a></li>
                <li><a role="button" href="javascript:;">{{$t('nav.explorer')}}</a></li>

                <li><a role="button" href="javascript:void(0)" arrow="true">{{$t('nav.download')}}</a>

                    <div class="menu-list">
                        <ul>
                            <li><a role="button" href="javascript:;">{{$t('nav.wallet_source_code')}}</a></li>
                            <li><a role="button" href="javascript:;">{{$t('nav.ide')}}</a></li>
                        </ul>
                    </div>
                </li>
                <li><a role="button" href="javascript:;">{{$t('nav.support')}}</a></li>

                <li><a role="button" href="javascript:void(0)" arrow="true">{{$t('nav.about')}}</a>
                    <div class="menu-list">
                        <ul>
                            <li><a role="button" href="javascript:;">{{$t('nav.team')}}</a></li>
                            <li><a role="button" class="contact_us" href="javascript:;">{{$t('nav.contact_us')}}</a></li>
                            <li><a role="button" href="javascript:;">{{$t('nav.joinus')}}</a></li>
                            <!--<li><a role="button" href="/about/businesscooperation"><%- LANG('Business Cooperation') %></a></li>-->

                        </ul>
                    </div>
                </li>
            
            </ul>
        </div>
        </div>
        <div class="grid right">
            <div class="menu">
            <ul>

                <!-- <li><a role="button" href="javascript:;"><i class="ub-icon ub-signin"></i>登录</a></li>
                <li><a role="button" href="javascript:;"><i class="ub-icon ub-signup"></i>注册</a></li> -->
                <li class="lang">
                  <a role="button" href="javascript:void(0)" arrow="true"><i class="ub-icon ub-lang"></i>{{language[lang]}}</a>
                    <div class="menu-list">
                        <ul>
                            <li v-if="key!=lang" v-for="(item,key) in language"><a role="button" class="item" @click="changeLang(key)">{{item}}</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
            </div>
    </div>
    <div class="mobile-menu-button">
        <span></span>
        <span></span>
        <span></span>
    </div>


       



</header>
</template>

<script>
import Vue from "vue";
export default {
  name: "Navbar",
  data() {
    return {
      language:{
        "zh-CN":"中文简体",
        "en":"English",
        "ko":"한국어",
        "ja":"日本语",
        "zh-TW":"中文繁体"
      }
    };
  },
  computed: {
    lang() {
      return Vue.config.lang;
    }
  },
  methods: {
    changeLang(lang) {
      this.$i18n.locale = lang;
      Vue.config.lang = lang;
      window.localStorage.setItem("lang", lang);
      window.location.reload()
    }
  },
  components: {}
};
</script>

