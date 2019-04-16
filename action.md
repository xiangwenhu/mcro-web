### Action 的定义

后台定义的一些操作, 比如 cookie, session, http 请求, 中间件, redis 等。

### 格式

```
{
    type: string;
    operate: string;
    param ?: any;
    data: [{
        path: string;
        name: string;
        default: string;
    }]
}
```

### 目前支持

- cookie
- session
- http 请求
- 状态检查？ 登录状态

后续

- 中间件
- redis

### 示例
