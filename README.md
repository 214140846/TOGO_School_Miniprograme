

**ToGo校园**

项目背景

近几年随着校园市场不断发展，校园服务行业也愈发鱼龙混杂。操作繁琐、功能单一、交互死板等,这些都是目前大部分校园服务存在的问题。

这个项目的初衷就是给同学们一个简单、方便、好用的校园小程序。目前，开源版本包含了基础的教务查询功能以及只有本校同学能使用的校园圈功能，后续也会不断开放运营版本的功能到开源项目中。

部署

- 将代码导入微信开发者工具，点选云开发。
- 将cloudfunctions中的全部函数均进入目录后npm install。
- 上传并部署全部云函数。
- 在数据库中分别创建 comments、commentback、share、star、system、users表，最后将根目录的database_export-VQvEVynX_ZnT.json文件导入system表中。
- 将system记录中的is_wx_killer字段改为false，即可开启校园圈功能

体验账号

u：201888888
p：1

所提供的账号为体验账号，在代码中涉及到学校教务等隐私的逻辑已经删除，但添加了详细注释希望能够为各位看官老爷们提供思路。



线上版本体验

联系我拿体验账号吧～。
![image](.idea/IMG_3275.JPG)

**开源不易，右上角点个star吧～**

合作交流
- 商业授权需联系我 发送【服务】获取商业授权以及其他服务内容
![image](.idea/13261623840424_.pic_hd.jpg)
![image](.idea/13271623840428_.pic_hd.jpg)
![image](.idea/13281623840432_.pic_hd.jpg)
![image](.idea/13291623840437_.pic_hd.jpg)
![image](.idea/13301623840443_.pic_hd.jpg)
![image](.idea/13311623840448_.pic.jpg)

[全黑科技官方主页](http://www.abtwork.com/?fileGuid=T6yPgqJ8v9PKXHqc)

