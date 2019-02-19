//用户列表
Vue.component('vue-test',
              {template:
               `<div>
            <select v-model="soflag">
                <option v-for="option in options" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
            <br/><textarea v-model="sovalue" rows="12" cols="150"></textarea>
            <br/><button @click="somoreuser" :disabled="sobtnDisabled">查询</button>
            <button @click="savehtml" :hidden="svbtnHidden">下载</button>
            <br/><div v-html="showdata"></div>
</div>
`
               ,data:function(){
                   return {
                       options:[
                           {value:-1,text:'搜索方式'}
                           ,{value:1,text:'用户ID'}
                           ,{value:2,text:'用户名称'}
                       ]
                       ,soflag:-1
                       ,sovalue:''
                       ,showdata:''
                       ,sobtnDisabled:false
                       ,svbtnHidden:true
                       ,obj:this.getinitobj()
                       ,dealBuff:[0,0,0]//总数,成功数,失败数
                       ,buffary:[]
                   };
               }
               ,methods:{
                   somoreuser:function(){
                       if(this.soflag<1||this.soflag>2){
                           console.error('请求参数错:soflag',soflag);
                           return;
                       }
                       var sss = new Set(this.sovalue.split(','));
                       this.dealBuff=[sss.size,0,0];
                       for(let key of sss)this.getuserinfo(this.soflag,sss[key]);
                   }
                   ,getuserinfo:function(soflag,sovalue){
                       var vurl = ['getUserInfo?soflag=',soflag,'&sovalue=',sovalue].join('');

                       this.showdata=['正在查询数据==>',soflag,sovalue].join(' ');

                       var info = [0,''];
                       if(soflag==1){
                           info[0]=sovalue;
                       }else if(soflag==2){
                           info[1]=sovalue;
                       }

                       //发送get请求
                       var promise = axios.get(vurl);
                       promise.then(res=>{
                           console.log(res);
                           var bk=res.data;
                           console.log(vurl,"==>",bk);
                           if(bk.idw>0&&bk.strw.length>0){
                               this.dealBuff[1]++;
                               if(soflag==1){
                                   info[1]=bk.strw;
                               }else if(soflag==2){
                                   info[0]=bk.idw;
                               }
                               this.buffary.push(info.join('\t'));
                               console.log(bk.idw,'\t',bk.strw);
                               return;
                           }else{
                               this.dealBuff[2]++;
                           }
                       });
                       promise.catch(error=>{
                           this.dealBuff[2]++;
                           console.error(vurl,error);
                       });

                       promise.finally(function(){
                           if(this.dealBuff[0]==(this.dealBuff[1]+this.dealBuff[2])){
                               this.showdata=['数据处理完成==>',this.dealBuff].join(' ');

                           }
                       });
                   }
                   ,savehtml:function(){
                       if(!this.obj.resp)return;
                       var resp = [this.obj.html];
                       if(typeof(saveAs) == "function"){
                           //以下代码要求FileSaver.js
                           var file = new File(resp, "xflist.xlsx", {type: "html/plain;charset=utf-8"});
                           saveAs(file);
                           return;
                       }

                       if(typeof(streamSaver) == "object"){
                           //以下代码要求StreamSaver.js
                           const fileStream = streamSaver.createWriteStream('xflist.xlsx')
                           const writer = fileStream.getWriter()
                           const encoder = new TextEncoder
                           let uint8array = encoder.encode(resp.join(''))

                           writer.write(uint8array)
                           writer.close()
                           return;
                       }
                       console.error('未找到合适的下载插件');
                   }

                   ,getinitobj:function(){
                       this.svbtnHidden=true;
                       this.showdata='';
                       return {tindex:11,pageSize:500,pageNumber:1,idw:0,strw:'',dataList:[],lastData:{},resp:false};
                   }


                   ,xflist:function(){

                       var obj = arguments[0];

                       var vurl = ['getConsumerPage?tindex=',obj.tindex,'&pageSize=',obj.pageSize,'&pageNumber=',obj.pageNumber,
                                   ,'&idw=',obj.idw].join('');

                       this.showdata=['正在查询数据==>',obj.tindex,obj.pageSize,obj.pageNumber,obj.idw,obj.strw].join(' ');

                       this.$http.get(vurl).then(function(res){
                           var bk=res.body;
                           console.log(bk);
                           console.log(obj);

                           obj.lastData = bk.data;
                           if(bk.data==null){
                               this.checkexit(obj);
                               return;
                           }
                           bk=bk.data;
                           obj.dataList=obj.dataList.concat(bk.dataList);
                           if(obj.pageNumber>=bk.pageCount){
                               this.checkexit(obj);
                               return;
                           }
                           if(obj.pageNumber<bk.pageCount){
                               obj.pageNumber+=1;
                               console.log(obj);
                               this.xflist(obj);
                           }
                       },function(){
                           console.log('请求失败处理');
                       });


                   }
                   ,checkexit:function(){
                       var obj = arguments[0];
                       if(obj.tindex<=0){
                           // savefile(obj.dataList);
                           obj.html=this.gethtml(obj.dataList);
                           this.showhtml();
                           this.sobtnDisabled=false;
                           obj.resp=true;
                           return;
                       }
                       obj.tindex-=1;
                       obj.pageNumber=1;
                       this.xflist(obj);
                   }
                   ,gethtml:function(){
                       var list = arguments[0];
                       var resp = ['<table border=1><tr><th>作品</th><th>章节</th><th>时间</th><th>贝数</th><th>消费类别</th></tr>'];
                       for(let key in list){
                           var map = list[key];
                           resp = resp.concat(['<tr><td>',map.bookTitle,'</td><td>',map.chapterTitle,'</td><td>',map.msgTime,'</td><td>',map.xfBei,'</td><td>',map.xfCategory,'</td></tr>']);
                       }
                       resp.push('</table>');
                       return resp.join('');
                   }
                   ,showhtml(){
                       this.svbtnHidden=false;
                       this.showdata=this.obj.html;
                   }



               }
              });

document.title='用户消费查询';
var vm = new Vue({el:'#app'});
window.onload = function(){
    vm = new Vue({
        el:'#app'
    });

}
