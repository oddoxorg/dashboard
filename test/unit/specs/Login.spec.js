import Vue from 'vue'
import Login from '@/views/Login'

describe('Login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Login)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#login h3').textContent)
      .toEqual('Login')
  })
})
