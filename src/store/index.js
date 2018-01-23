import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import util from '../util'
import Request from '../util/request'
import debug from '../util/debug'

Vue.use(Vuex);

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
const UPDATE_DOC = 'UPDATE_DOC';

const mutations = {
  [SWITCH_LOGIN](state, bool) {
    state.login = bool
  },
  [SWITCH_EDITOR](state, bool) {
    state.editor = bool;
    /*打开编辑器，初始化doc*/
    state.doc = {}
  },
  [GET_TOC](state, TOC) {
    state.TOC = TOC
  },
  [GET_DOC](state, doc) {
    state.doc = doc
  },
  [UPDATE_DOC](state, {type, value}) {
    switch (type) {
      case 'title':
        state.doc.title = value;
        break;
      case 'alias_id':
        state.doc.alias_id = value;
        break;
      case 'text':
        state.doc.text = value;
        break;
      case 'lang':
        state.doc.lang = value;
        break;
      case 'creator':
        state.doc.creator = value;
        break;
      case 'updater':
        state.doc.updater = value;
        break;
      case 'parent_id':
        state.doc.parent_id = value;
        break;
    }
  },
};

const getters = {
  created: state => {
    return util.convertCST(state.doc.created)
  },
  updated: state => {
    return util.convertCST(state.doc.updated)
  },
};

const actions = {
  switchLogin({commit}, bool) {
    commit(SWITCH_LOGIN, bool)
  },
  getTOC({commit}, lang) {
    Request.fetchAsync('/admin/nodes/' + lang, 'get').then(rs => {
      if (!!rs) {
        commit(GET_TOC, util.combine(util.addAttr(rs)))
      } else if (rs === null) {
        commit(GET_TOC, [])
      }
    })
  },
};


export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: debug ? [createLogger({})] : []  //如果是开发版本则输出mutation日志到控制台
})
