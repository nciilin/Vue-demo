import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'pn9tWc4dGgDnvo5yaKG2b9Wr-gzGzoHsz';
var APP_KEY = 'lFulSRhgDQ2hTj0fyIkwPchI';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});



var app = new Vue({
  el: '#app',
  data: {
    actionType: 'signUp',
    currentUser: null,
    formData: {
      username: '',
      password: ''
    },
    newTodo: '',
    todoList: []
  },
  created() {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos', dataString)
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
    this.currentUser = this.getCurrentUser()

  },
  methods: {
    addTodo() {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo = ''
    },
    removeTodo(todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    signUp() {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
        this.formData.username = ''
        this.formData.password = ''
      }, (error) => {
        alert('注册失败')
      });
    },
    login() {
      AV.User.logIn(this.formData.username, this.formData.password)
        .then((loginedUser) => {
          this.currentUser = this.getCurrentUser()
          this.formData.username = ''
          this.formData.password = ''
        }, (error) => {
          alert('登陆失败')
        })
    },
    getCurrentUser() {
      let current = AV.User.current()
      if (current) {
        let { id, createdAt, attributes: { username } } = current
        return { id, username, createdAt }
      } else {
        return null
      }
    },
    logout() {
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    }
  }
  })                                                               
