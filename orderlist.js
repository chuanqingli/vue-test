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
                   };
               }
               ,methods:{
                   getuserinfo:function(){
                       var vurl = ['getUserInfo?soflag=',this.soflag,'&sovalue=',this.sovalue].join('');
                       //发送get请求
                       var promise = axios.get(vurl);
                       promise.then(res=>{
                           console.log(res);
                           var bk=res.data;
                           console.log(vurl,"==>",bk);
                           if(bk.idw>0&&bk.strw.length>0){
                               if(bk.idw==this.obj.idw){
                                   return;
                               }

                               this.obj=this.getinitobj();
                               this.obj.idw=bk.idw;
                               this.obj.strw=bk.strw;

                               this.sobtnDisabled=true;
                               this.xflist(this.obj);
                               return;

                           }
                           if(typeof(bk)== "string"){
                               this.showdata = bk;
                               return;
                           }
                           this.showdata = ['用户不存在==>',bk].join('');
                       });
                       promise.catch(error=>{
                           console.error(vurl,error);
                       });
                   }
                   ,savehtml:function(){
                       var resp = [this.obj.html];

                       var respno = download(resp);
                       if(respno<=0){
                           console.error('未找到合适的下载插件');
                       }
                   }

                   ,getinitobj:function(){
                       this.svbtnHidden=true;
                       this.showdata='';
                       return {tindex:11,pageSize:500,pageNumber:1,idw:0,strw:'',dataList:[]};
                   }


                   ,xflist:function(obj){
                       var vurl = ['getConsumerPage?tindex=',obj.tindex,'&pageSize=',obj.pageSize,'&pageNumber=',obj.pageNumber,
                                   ,'&idw=',obj.idw].join('');

                       this.showdata=['正在查询数据==>',obj.tindex,obj.pageSize,obj.pageNumber,obj.idw,obj.strw].join(' ');

                       var promise = axios.get(vurl);

                       promise.then(res=>{
                           var bk=res.data;
                           console.log(bk);
                           console.log(obj);

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
                       });
                       promise.catch(error=>{
                           console.error(vurl,error);
                       });
                   }
                   ,checkexit:function(obj){
                       if(obj.tindex<=0){
                           this.showhtml(obj);
                           return;
                       }
                       obj.tindex-=1;
                       obj.pageNumber=1;
                       this.xflist(obj);
                   }
                   ,gethtml:function(list){
                       var resp = ['<table border=1><tr><th>作品</th><th>章节</th><th>时间</th><th>贝数</th><th>消费类别</th></tr>'];
                       for(let key in list){
                           var map = list[key];
                           resp = resp.concat(['<tr><td>',map.bookTitle,'</td><td>',map.chapterTitle,'</td><td>',map.msgTime,'</td><td>',map.xfBei,'</td><td>',map.xfCategory,'</td></tr>']);
                       }
                       resp.push('</table>');
                       return resp.join('');
                   }
                   ,showhtml:function(obj){
                       this.svbtnHidden=false;
                       this.showdata=this.gethtml(obj.dataList);
                       this.sobtnDisabled=false;
                   }
               }
              });


function download(resp){
    if(typeof(saveAs) == "function"){
        //以下代码要求FileSaver.js
        var file = new File(resp, "xflist.xlsx", {type: "html/plain;charset=utf-8"});
        saveAs(file);
        return 1;
    }

    if(typeof(streamSaver) == "object"){
        //以下代码要求StreamSaver.js
        const fileStream = streamSaver.createWriteStream('xflist.xlsx')
        const writer = fileStream.getWriter()
        const encoder = new TextEncoder
        let uint8array = encoder.encode(resp.join(''))

        writer.write(uint8array)
        writer.close()
        return 2;
    }
    return -1;
}

document.title='用户消费查询';
var vm;// = new Vue({el:'#app'});
window.onload = function(){
    vm = new Vue({
        el:'#app'
    });

}
