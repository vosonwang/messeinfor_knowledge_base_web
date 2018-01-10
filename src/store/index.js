import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


// initial state
const state = {
  login: false,
};

const SWITCH_LOGIN = 'SWITCH_LOGIN';

const mutations = {
  [SWITCH_LOGIN](state, bool) {
    state.login = bool
  },

};


const actions = {
  switchLogin({commit}, bool) {
    commit(SWITCH_LOGIN, bool)
  },
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  strict: debug,
  plugins: debug !== debug ? [createLogger()] : []
})
