- [x] 页面刷新问题 => cookie 识别
- [x] header 传递额外参数问题 
  1. 静态的通过proxy配置
  2. 动态的比如 authorization 的 token
- [x] 请求数据格式问题    
  * json
  * x-www-form-urlencoded
- [x] 代理额外的 headers, body , query 等等   
    headers 支持   
    body 未支持
- [ ] ACL 如何接入   
    变通方便，请求acl带配置属性
- [x] 支持存储数据 
  - 登录后 session/cookie
- [ ] 抽象一些操作
  - session 存值，删除
  - http 请求取结果
- [ ] 代理返回结果Filter
- [ ] 支持App的全局配置
- [ ] session和cookie操作的API?
- [ ] Handler 分为 谓词 + action
