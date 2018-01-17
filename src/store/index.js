import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import util from '../util'
import Request from '../util/request'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


// initial state
const state = {
  login: false,
  TOC: [],
  editor: false,
  doc: {},
  doc_en: {},
  lang: 0
}

const SWITCH_LOGIN = 'SWITCH_LOGIN'
const SWITCH_LANG = 'SWITCH_LANG'
const SWITCH_EDITOR = 'SWITCH_EDITOR'
const GET_TOC = 'GET_TOC'
const GET_DOC = 'GET_DOC'
const GET_DOC_EN = 'GET_DOC_EN'

const mutations = {
  [SWITCH_LOGIN](state, bool) {
    state.login = bool
  },
  [SWITCH_LANG](state, int) {
    state.lang = int
  },
  [SWITCH_EDITOR](state, bool) {
    state.editor = bool
  },
  [GET_TOC](state, TOC) {
    state.TOC = TOC
  },
  [GET_DOC](state, doc) {
    state.doc = doc
  },
  [GET_DOC_EN](state, doc_en) {
    state.doc = doc_en
  },
}


const actions = {
  getDoc({commit}, doc) {
    commit(GET_DOC, doc)
  },
  getDocEn({commit}, doc) {
    commit(GET_DOC_EN, doc)
  },
  switchEditor({commit}, bool) {
    commit(SWITCH_EDITOR, bool)
  },
  switchLang({commit}, lang) {
    let int = 0
    if (lang === 'en-US') {
      int = 1
    }
    commit(SWITCH_LANG, int)
  },
  switchLogin({commit}, bool) {
    if (!bool) {
      /*不管是首次登录还是超时后登录，登录即请求最新的目录数据*/
      Request.fetchAsync('/admin/docs/' + 0, 'get').then(rs => {
        if (rs) {
          commit(GET_TOC, rs)
        } else {
          console.log(rs)
        }
      })
    }
    commit(SWITCH_LOGIN, bool)
  },
  getTOC({commit}, lang) {
    Request.fetchAsync('/admin/docs/' + lang, 'get').then(rs => {
      if (rs) {
        commit(GET_TOC, rs)
      } else if (rs === null) {
        commit(GET_TOC, [])
      }
    })
  }
}

const getters = {
  comTOC: state => {
    if (state.TOC === []) {
      return []
    }
    return util.combine(util.addAttr(state.TOC))
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
