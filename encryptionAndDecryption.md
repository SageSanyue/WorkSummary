# 明文加解密  
## 后端定好加密方案，前端配合
后端加密方法已定：AES+ECB+PKCS5的方式；公钥已定：HFQDATAREPORT19!  
例如：123456加密后是MVqah3VDBNzLzsYdkWW/xQ==
(注：但据资料显示：" AES加密模式：这里我们选择的是ECB(ee cc block)模式。这是AES所有模式中最简单也是最不被人推荐的一种模式，因为它的固定的明文对应的是固定的密文，很容易被破解。")  
我们可以先去在线工具上体验一下加解密：[在线验证工具](https://www.keylala.cn/aes)  
为配合此次后端技术方案，AES+ESB的JavaScript加密选用了天生支持AES各种子集、其RSA与Java完美配合的Forge库。  
使用forge编写的js代码实现AES-ECB加密的代码如下：  
```
const cipher = forge.cipher.createCipher('AES-ECB', '这里是16字节密钥');
cipher.start();
cipher.update(forge.util.createBuffer('这里是明文'));
cipher.finish();
const result = forge.util.encode64(cipher.output.getBytes())
```  
注：上段加密资料来源于 https://segmentfault.com/a/1190000019437132  
但解密资料网上稍少些，或是有但我这边解密MVqah3VDBNzLzsYdkWW/xQ==还原不到123456（而是其他类型code码），参考了如下网站
https://github.com/digitalbazaar/forge/issues/552    
注意解密的代码一定要这样写：decipher.update(forge.util.createBuffer(forge.util.decode64(data)))  
## 应用在项目中如下：  
1.控制台操作npm install node-forge引入资源包  
2.在工具js文件夹里（ src/assets/js/utils.js）引入  
```
var forge = require('node-forge')
const cipher = forge.cipher.createCipher('AES-ECB', 'HFQDATAREPORT19!')
const decipher = forge.cipher.createDecipher('AES-ECB', 'HFQDATAREPORT19!')

let utils = {
  // 明文加密-配合后端AES+ECB+PKCS5
  forgeDigest(data) {
    cipher.start()
    cipher.update(forge.util.createBuffer(data))
    cipher.finish()
    const result = forge.util.encode64(cipher.output.getBytes())
    return result
  },
  // AES-ECB解密-配合后端AES+ECB+PKCS5
  forgeDecrypt(data) {
    decipher.start()
    decipher.update(forge.util.createBuffer(forge.util.decode64(data)))
    decipher.finish()
    const result = decipher.output.getBytes()
    return result
  }
}
export default utils
```  
3.在你的.vue文件里做测试  
```
created() {
  console.log(this.$utils.forgeDigest('123456'), '加密试验') // 控制台打印出“MVqah3VDBNzLzsYdkWW/xQ==”
  console.log(this.$utils.forgeDecrypt('MVqah3VDBNzLzsYdkWW/xQ=='), '解密试验') // 控制台打印出“123456”
}
```
效果图：![控制台](https://i.loli.net/2019/07/22/5d3547e84905450070.jpg)  
4.真正写业务代码  
```
<template>
  <el-table :data="tableData" style="width: 100%">
    ...
    <el-table-column  label="密码" width="380">
      <template slot-scope="scope">
        <span>{{scope.row.f_password | transpassowrd}}</span>
        <span v-if="scope.row.encryptIf">{{$utils.forgeDecrypt(scope.row.f_password) | transpassowrd}}</span>
        <span v-else>{{$utils.forgeDecrypt(scope.row.f_password)}}</span>
        <i :class="scope.row.encryptIf ? 'close' : 'open'" @click="handleCrypt(scope.row)"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

...
<script>
  export default {
    data() {
      return {}
    },
    created() {
      this.queryServe()
    },
    methods: {
      handleCrypt(item) {
        item.encryptIf = !item.encryptIf // 点击“睁眼/闭眼”图标可切换该行密码明文与否
      },
      queryServe(){
        queryServe().then(res =>{
          if(res.status.code == 0) {
            this.tableData = res.result
            for (let i = 0; i < res.result.length; i++) {
              res.result[i].encryptIf = true // 给接口返回的每一行数据对象加一个encryptIf属性判断加密与否，默认true即加密
            }
            this.tableData = res.result;
          }else{
            this.$message.error("查询失败");
          }
        }
      }
    },
    filters: {
      transpassowrd(param){
        let password= "";
        if(param){
          param +="";
          let len = param.length;
          for(let i = 0; i<param.length; i ++){
            password += "*";
          }
          return password;
        }else{
          return ;
        }
      }
    }
  }
</script>

...
<style lang="less" scoped>
.close:after {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(../../assets/img/encrypt.png);
  background-size: 100%;
}
.open:after {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(../../assets/img/decrypt.png);
  background-size: 100%;
}
</style>
```  
实际网站应用效果图(需求稍有变动但原理一致):  
![密码加解密显示](https://i.loli.net/2019/07/22/5d3548a5d52da80388.jpg)
