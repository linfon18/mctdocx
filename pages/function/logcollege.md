# MCT_LogServer

这是 **MinecraftConnectTool** 的日志收集服务端，由 .NET8 驱动
监听 TCP/HTTP 端口 → 接收 JSON 日志 → 按 IP 限流 → 储存为文本文件。

## 简介  
- **无数据库**：日志直接写成 `.txt`，方便排查。  
- **跨平台**：Windows / Linux 直接运行单文件即可。  
- **带限流**：默认单 IP 每小时最多 3 次上传，可改。  
- **支持 Frp**：若当前工作环境无公网,可使用Frp,同时开启 PROXY Protocol v2 ,以便获取真实上传 IP。

## 构建方式  
1. 安装 [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)。  
2. 在项目根目录执行：  
   ```bash
   dotnet build -c Release
   ```  
   可执行文件会出现在  
   ```
   bin/Release/net8.0/LogServer(.exe)
   ```

> Visual Studio 用户：直接打开 `.sln`，点 **Build → Build Solution** 即可。

## 运行  
```bash
# Windows
.\bin\Release\net8.0\LogServer.exe

# Linux
./bin/Release/net8.0/LogServer
```

首次运行会在程序同目录创建 `logtext/` 文件夹，所有日志将会保存在里面。  
如需改端口、限流阈值、是否启用 Frp，直接改 `Program.cs` 顶部的几个常量后重新 build 即可。

## 日志格式  
客户端上传的 JSON 需满足：  
```json
{
  "Time": "2024-07-21T12:34:56",
  "MachineName": "DESKTOP-ABC",
  "Content": "xxxxxx"
}
```
服务端会追加写入到  
```
logtext/2024-07-21-DESKTOP-ABC.txt
```
