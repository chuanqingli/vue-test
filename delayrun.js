document.title='定时处理';
Vue.component('vue-test',
              {template:
               `<div>
开始时间:<input v-model='from'>结束时间:<input v-model='to'>
            <select v-model="soflag">
                <option v-for="option in options" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
            <br/><textarea v-model="sovalue" rows="12" cols="150"></textarea>
            <br/><button @click="submitdata" :disabled="sobtnDisabled">确认</button>
            <button @click="savehtml" :hidden="svbtnHidden">下载</button>
            <br/><div v-html="showdata"></div>
</div>
`
               ,data:function(){
                   return {
                       options:[
                           {value:-1,text:'处理方式'}
                           ,{value:1,text:'给作品加皇冠'}
                           ,{value:2,text:'给读者加皇冠'}
                           ,{value:3,text:'投虚拟票'}
                       ]
                       ,soflag:-1
                       ,sovalue:''
                       ,showdata:''
                       ,from:''
                       ,to:''
                       ,sobtnDisabled:false
                       ,svbtnHidden:true
                       ,dealBuff:[0,0,0]//总数,成功数,失败数
                   };
               }
               ,methods:{
                   submitdata:function(){
                       if(this.soflag<1||this.soflag>3){
                           this.showdata=['请求参数错:soflag=',this.soflag].join('');
                           return;
                       }
                       var sss = this.sovalue.split(':');
                       if(sss.length!=2){
                           this.showdata=['请求参数错:sovalue不能识别为两个有效数组==>',this.sss.length].join('');
                           return;
                       }

                       var runids=sss[0].split(',');
                       var runcounts=sss[1].split(',');
                       if(runids.length<=0||runids.length!=runcounts.length){
                           this.showdata=['请求参数错:sovalue不能识别为两个有效数组==>(',runids.length,',',runcounts.length,')'].join('');
                           return;
                       }

                       if(this.from.length<=0||this.to.length<=0){
                           this.showdata=['请求参数错:不能识别两个有效时间==>(',this.from,',',this.to,')'].join('');
                           return;
                       }

                       this.dealBuff=[runids.length,0,0];
                       for(let key in runids)this.delayrun(runids[key],runcounts[key]);
                   }
                   ,reviewshowdata:function(){
                       this.showdata=this.gethtml();
                   }
                   ,delayrun:function(runid,runcount){
                       this.showdata=['正在提交数据sss==>',runid,runcount].join(' ');

                       var vurl = ['delay_run_req_insertMore?runtype=',this.soflag,'&runid=',runid
                ,'&runcount=',runcount,'&from=',this.from,'&to=',this.to].join('');

                       var dealbuff=this.dealBuff;
                       //发送get请求
                       var promise = axios.get(vurl);
                       promise.then(res=>{
                           console.log(res);
                           var bk=res.data;

                           if(bk.code<0){
                               this.showdata=bk.message;
                               throw new Error(bk.message);
                           }
                           console.log(vurl,"==>",bk);
                           this.dealBuff[1]++;
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
                           this.reviewshowdata();
                       });
                   }
                   ,savehtml:function(){
                       var respno = download([this.showdata]);
                       if(respno<=0){
                           console.error('未找到合适的下载插件');
                       }
                   }

                   ,gethtml:function(){
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

var vm = new Vue({el:'#app'});
var co = vm.$children[0];
window.onload = function(){
    vm = new Vue({
        el:'#app'
    });
    co = vm.$children[0];
}
