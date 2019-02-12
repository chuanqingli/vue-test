var app,app2,app3,app4,app5,app6,app7,app8,app9,app10;
window.onload=function (){

app = new Vue({
  el: '#app',
  data: {
    message: '你好，黎明abcd1dfds234!'
  }
});
app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date().toLocaleString()
  }
})

app3 = new Vue({
        el: '#app-3',
        data: {
        seen: true
        }
        })
app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '整个牛项目' }
    ],
      todos2: '海南,天涯,社区,海口,龙华'.split(',')
  }
})
app5 = new Vue({
        el: '#app-5',
        data: {
        message: 'Hello Vue.js，黎明海南!'
        },
        methods: {
        reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
        }
        }
        })
app6 = new Vue({
        el: '#app-6',
        data: {
        message: 'Hello Vue!'
        }
        })

        Vue.component('todo-item', {
        props: ['todo'],
        template: '<li>{{ todo.text }}</li>'
        })

app7 = new Vue({
        el: '#app-7',
        data: {
        groceryList: [
        { id: 0, text: '蔬菜' },
        { id: 1, text: '奶酪' },
        { id: 2, text: '随便其它什么人吃的东西' }
        ]
        }
})

app8 = new Vue({
        el: '#app-8',
    data: {
        testid:'licq',testhtml:'<B>低估好</B>'
    }})


}


function updapp4(){
app4.todos='你好,黎明,大学,中青'.split(',').map(function(value,index){return {text:value}})
}
