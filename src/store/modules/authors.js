import database from '../../api/database'
import * as types from '../mutation-types'

// initial state
const state = {
  author: null,
  authors: null
}

// getters
const getters = {
  getAllAuthors: state => state.authors,
  getCurrentAuthor: state => state.author
}

// actions
const actions = {

  allAuthors ({ commit }) {
    return new Promise((resolve, reject) => {
      database.allAuthors(authors => {
        commit(types.SET_AUTHORS, authors)
        resolve()
      }, err => {
        commit(types.SET_AUTHORS, null)
        reject(err)
      })
    })
  },

  searchAuthors ({ commit }, text) {
    return new Promise((resolve, reject) => {
      if (text === null || text.length < 1) {
        // if empty search, return all
        resolve()
      } else {
        // otherwise do normal search
        database.searchAuthors(text, authors => {
          commit(types.SET_AUTHORS, authors)
          resolve()
        }, err => {
          commit(types.SET_AUTHORS, null)
          reject(err)
        })
      }
    })
  },

  setCurrentAuthor ({ commit }, id) {
    return new Promise((resolve, reject) => {
      if (id === null) {
        commit(types.SET_AUTHOR, null)
        resolve()
      } else {
        database.readAuthor(id, author => {
          commit(types.SET_AUTHOR, author)
          resolve()
        }, err => {
          commit(types.SET_AUTHOR, null)
          reject(err)
        })
      }
    })
  },

  createAuthor ({ commit }, data) {
    return new Promise((resolve, reject) => {
      database.createAuthor(data, author => {
        commit(types.SET_AUTHOR, author)
        resolve()
      }, err => {
        reject(err)
      })
    })
  },

  updateAuthor ({ commit }, data) {
    return new Promise((resolve, reject) => {
      database.updateAuthor(data, author => {
        commit(types.SET_AUTHOR, author)
        resolve()
      }, err => {
        reject(err)
      })
    })
  },

  deleteAuthor ({ commit }, data) {
    return new Promise((resolve, reject) => {
      database.deleteAuthor(data, author => {
        commit(types.SET_AUTHOR, null)
        resolve()
      }, err => {
        reject(err)
      })
    })
  }

}

// mutations
const mutations = {
  [types.SET_AUTHORS] (state, authors) {
    state.authors = authors
  },
  [types.SET_AUTHOR] (state, author) {
    state.author = author
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}