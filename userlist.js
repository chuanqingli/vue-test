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
                       ,dealBuff:[0,0,0]//总数,成功数,失败数
                       ,idm:{}
                       ,strm:{}
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
                       for(let key of sss)this.getuserinfo(this.soflag,key);
                   }
                   ,reviewshowdata:function(mmm){
                       var sss = this.sovalue.split(',');
                       this.showdata=this.gethtml(sss,mmm);
                   }
                   ,getuserinfo:function(soflag,sovalue){
                       this.showdata=['正在查询数据sss==>',soflag,sovalue].join(' ');
                       //已经查过的，就不用再查了
                       var mmm=(soflag==1)?this.idm:this.strm;
                       var dealbuff=this.dealBuff;
                       if(mmm[sovalue]!=null){
                           dealbuff[0]--;
                           if(dealbuff[0]==0){
                               this.reviewshowdata(mmm);
                           }
                           return;
                       }

                       var vurl = ['getUserInfo?soflag=',soflag,'&sovalue=',sovalue].join('');

                       //发送get请求
                       var promise = axios.get(vurl);
                       promise.then(res=>{
                           console.log(res);
                           var bk=res.data;
                           console.log(vurl,"==>",bk);
                           if(bk.idw>0&&bk.strw.length>0){
                               this.dealBuff[1]++;
                               mmm[sovalue]=(soflag==1)?bk.strw:bk.idw;
                               console.log(JSON.stringify(bk));
                               return;
                           }else{
                               this.dealBuff[2]++;
                           }
                       });
                       promise.catch(error=>{
                           this.dealBuff[2]++;
                           console.error(vurl,error);
                       });

                       promise.finally(res=>{
                           if(dealbuff[0]!=(dealbuff[1]+dealbuff[2])){
                               this.showdata=['数据处理完成==>',JSON.stringify(dealbuff)].join(' ');
                               return;
                           }
                           this.reviewshowdata(mmm);
                       });
                   }
                   ,savehtml:function(){
                       var respno = download([this.showdata]);
                       if(respno<=0){
                           console.error('未找到合适的下载插件');
                       }
                   }

                   ,gethtml:function(sss,mmm){
                       console.log(sss,mmm);
                       var resp = ['<table border=1><tr><th>key</th><th>value</th></tr>'];
                       for(let key in sss){
                           resp=resp.concat(['<tr><td>',sss[key],'</td><td>',mmm[sss[key]],'</td></tr>']);
                       }
                       resp.push('</table>');
                       return resp.join('');
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

document.title='用户查询';
var vm = new Vue({el:'#app'});
window.onload = function(){
    vm = new Vue({
        el:'#app'
    });

}
