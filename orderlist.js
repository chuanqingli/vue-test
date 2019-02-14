Vue.component('vue-test',
              {template:
`<div>
            <select v-model="soflag">
                <option v-for="option in options" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
            <input v-model="sovalue">
            <br/><button @click="getuserinfo" :disabled="sobtnDisabled">查询</button>
            <button @click="savehtml">下载</button>
            <br/><div v-html="showdata"></div>
</div>
`
               ,data:function(){
                   return {
             options:[
                 {value:-1,text:'搜索方式'}
                 ,{value:1,text:'用户ID'}
                 ,{value:2,text:'用户名称'}
             ],
             soflag:-1,
             sovalue:'',
             showdata:'',
             sobtnDisabled:false,
             svbtnShow:false
                   };
               },
         methods:{
             getuserinfo(){
                 var vurl = ['getUserInfo?soflag=',this.soflag,'&sovalue=',this.sovalue].join('');
                 console.log(vurl);
                 //发送get请求
                 this.$http.get(vurl).then(function(res){
                     document.write(res.body);
                 },function(){
                     console.log('请求失败处理');
                 });


             },
             savehtml(){}
         }


}
             );

var vm2 = new Vue({
    el:'#app2'
});


// var vm=new Vue({
//          el: '#app',
//          data:{
//              options:[
//                  {value:-1,text:'搜索方式'}
//                  ,{value:1,text:'用户ID'}
//                  ,{value:2,text:'用户名称'}
//              ],
//              soflag:-1,
//              sovalue:'',
//              showdata:'',
//              sobtnDisabled:false,
//              svbtnShow:false
//          },
//          methods:{
//              getuserinfo(){
//                  var vurl = ['getUserInfo?soflag=',this.soflag,'&sovalue=',this.sovalue].join('');
//                  console.log(vurl);
//                  //发送get请求
//                  this.$http.get(vurl).then(function(res){
//                      document.write(res.body);
//                  },function(){
//                      console.log('请求失败处理');
//                  });


//              },
//              savehtml(){}
//          }

//      })
