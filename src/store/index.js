import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

//外部要使用vuex 前面要加export 意思是对外公开了
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})
