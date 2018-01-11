import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import util from '../util'
import Request from '../util/request'


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


// initial state
const state = {
  login: false,
  tocs: [],
  editor: false,
  doc: {}
};

const SWITCH_LOGIN = 'SWITCH_LOGIN';
const SWITCH_EDITOR = 'SWITCH_EDITOR';
const GET_TOCS = 'GET_TOCS';
const GET_DOC = 'GET_DOC';

const mutations = {
  [SWITCH_LOGIN](state, bool) {
    state.login = bool
  },
  [SWITCH_EDITOR](state, bool) {
    state.editor = bool
  },
  [GET_TOCS](state, tocs) {
    state.tocs = tocs;
  },
  [GET_DOC](state, doc) {
    state.doc = doc;
  },
};


const actions = {
  getDoc({commit},doc) {
    commit(GET_DOC, doc);
  },
  switchEditor({commit}, bool) {
    commit(SWITCH_EDITOR, bool);
  },
  switchLogin({commit}, bool) {
    if (!bool) {
      /*不管是首次登录还是超时后登录，登录即请求最新的目录数据*/
      Request.fetchAsync('/admin/docs/' + 0, 'get').then(rs => {
        if (rs) {
          commit(GET_TOCS, rs);
        } else {
          console.log(rs)
        }
      })
    }
    commit(SWITCH_LOGIN, bool)
  },
  getTocs({commit}, lang) {
    Request.fetchAsync('/admin/docs/' + lang, 'get').then(rs => {
      if (rs) {
        commit(GET_TOCS, rs);
      } else {
        console.log("获取目录失败")
      }
    })
  }
};

const getters = {
  proTocs: state => {
    if (state.tocs === []) {
      return []
    }
    return util.combine(util.addAttr(state.tocs))
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug,
  plugins: debug !== debug ? [createLogger()] : []
})
