import { reqLogin, reqLogout, reqGetInfo, reqUserStatus } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userId: '',
    name: '',
    avatar: '',
    status: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_STATUS(state, value) {
    state.status = value;
  },

}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await reqLogin({ name: username.trim(), password: password });
    if (result.code == 200) {
      commit('SET_TOKEN', result.data.original.access_token);
      setToken(result.data.original.access_token);
      // resolve()
      return 'success';
    } else {
      return Promise.reject(new Error(result.message));
    }
  },

  // get user info
  async getInfo({ commit }) {
    let result = await reqGetInfo();

    if (result.code == 200) {
      const { data } = result
      if (!data) {
        return reject('验证失败，请重新登录。')
      }
      const { name, avatar } = data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      // resolve(data)
      return 'success'
    } else {
      reject(new Error(result.message))
    }
  },

  // user logout
  async logout({ commit, state }) {
    let result = await reqLogout();
    if (result.code == 200) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      location.reload()
      // resolve()
      return 'success';
    } else {
      reject(new Error(result.message))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 用户状态数据
  async getUserStatus({commit}) {
    let result = await reqUserStatus();
    if (result.code == 200) {
      commit('SET_STATUS', result.data);
      return 'success';
    } else {
      return Promise.reject(new Error(result.message));
    }
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

