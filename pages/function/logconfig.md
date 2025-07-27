## 配置说明⚙

| 变量 | 默认值 | 用途 | 改完记得 |
|---|---|---|---|
| `TcpPort`  | 17500 | 日志上传端口 | 重新 build |
| `HttpPort`  | 17501 | 健康检查端口 | 重新 build |
| `EnableHttp`  | true | 是否开启 HTTP 探活 | 重新 build |
| `MaxUploadPerHour`  | 3 | 单 IP 每小时最大上传次数（0=不限） | 重新 build |
| `UseFrp`  | false | 开=true 才能从 Frp 拿到真实 IP | 重新 build |
UseFrp请搭配v2proxy协议使用
 🆗**改完以上任何一项 → 重新 `dotnet build` 即可生效！**
