import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import util from '../util'
import Request from '../util/request'
import moment from 'moment'
import debug from '../util/debug'

Vue.use(Vuex);


// initial state
const state = {
  login: false,
  TOC: [],
  editor: false,
  doc: {},
};

const SWITCH_LOGIN = 'SWITCH_LOGIN';
const SWITCH_EDITOR = 'SWITCH_EDITOR';
const GET_TOC = 'GET_TOC';
const GET_DOC = 'GET_DOC';

const mutations = {
  [SWITCH_LOGIN](state, bool) {
    state.login = bool
  },
  [SWITCH_EDITOR](state, bool) {
    state.editor = bool
  },
  [GET_TOC](state, TOC) {
    state.TOC = TOC
  },
  [GET_DOC](state, doc) {
    state.doc = doc
  }
};


const actions = {
  getDoc({commit}, doc) {
    commit(GET_DOC, doc)
  },
  requireDoc({commit}, {id: id, lang: lang}) {
    let int = 0;
    if (lang === 'en') {
      int = 1;
    }
    return Request.fetchAsync("/docs/" + id, "get", null, {"id": int})
  },
  switchEditor({commit}, bool) {
    commit(SWITCH_EDITOR, bool)
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
      if (!!rs) {
        commit(GET_TOC, rs)
      }else if(rs === null) {
        commit(GET_TOC, [])
      }
    })
  },
};

const getters = {
  comTOC: state => {
    if (state.TOC === []) {
      return []
    }
    return util.combine(util.addAttr(state.TOC))
  },
  created: state => {
    if (state.doc.created === undefined) {
      return ""
    }
    return moment(state.doc.created).utc().format('YYYY-MM-DD HH:mm:ss')
  },
  updated: state => {
    if (state.doc.created === undefined) {
      return ""
    }
    return moment(state.doc.updated).utc().format('YYYY-MM-DD HH:mm:ss')
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  // TODO update template
  plugins: debug ? [createLogger({})] : []  //如果是开发版本则输出mutation日志到控制台
})
