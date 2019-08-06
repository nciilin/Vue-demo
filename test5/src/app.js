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

      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
     
      avTodos.set('content', dataString);
      avTodos.setACL(acl)
      avTodos.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('保存成功');
      }, function (error) {
        // 异常处理
        console.error('保存失败');
      });
    }

    this.currentUser = this.getCurrentUser()
    if(this.currentUser){
      var query = new AV.Query('AllTodos');
      query.find()
      .then((todos) => {
        let avAllTodos = todos[0] 
        let id = avAllTodos.id
        this.todoList = JSON.parse(avAllTodos.attributes.content)
        this.todoList.id = id 
      }, function(error){
        console.error(error) 
      })
    }
  },
  methods: {
    updateTodos: function(){
      let dataString = JSON.stringify(this.todoList) 
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(),true) 
      acl.setWriteAccess(AV.User.current(),true) 

      avTodos.set('content', dataString);
      avTodos.save().then((todo) =>{
        this.todoList.id = todo.id 
        console.log('保存成功');
      }, function (error) {
        console.log('保存失败');
      });
    },
    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },
    addTodo() {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false
      })
      this.newTodo = ''
      this.saveOrUpdateTodos()
    },
    removeTodo(todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
      this.saveOrUpdateTodos()
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
        console.log('注册失败')
      });
    },
    login() {
      AV.User.logIn(this.formData.username, this.formData.password)
        .then((loginedUser) => {
          this.currentUser = this.getCurrentUser()
          this.formData.username = ''
          this.formData.password = ''
        }, (error) => {
          console.log('登陆失败')
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
