# MCTRoomListService 房间列表服务

MCTRoomListService 是 MinecraftConnectTool 的房间列表管理服务，提供玩家管理、房间管理、心跳检测等功能。

## 功能特性

- 🏠 **房间管理** - 创建、关闭、查询房间
- 👥 **玩家管理** - 加入、离开、踢出玩家
- 💓 **心跳检测** - 自动检测玩家在线状态
- 🔌 **多平台支持** - 支持 C#、Android (Kotlin) 等客户端接入

## 技术栈

- **后端框架**: ASP.NET Core 8.0
- **API 协议**: HTTP REST API
- **数据格式**: JSON
- **默认端口**: 30147

## 快速开始

### 服务器地址

```
http://127.0.0.1:30147
```

### Swagger UI

```
http://127.0.0.1:30147/swagger
```

## 文档导航

| 文档 | 说明 |
|------|------|
| [API 参考](./roomlist-api) | 完整的 REST API 接口文档 |
| [Android 接入](./roomlist-android) | Kotlin 客户端接入指南 |
| [C# 客户端接入](./roomlist-csharp) | C# 客户端接入指南 |

## 核心概念

### 房间 (Room)

房间是玩家联机的容器，由房主创建，包含房间代码、房主 IP、创建时间等信息。

```json
{
  "roomCode": "APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG",
  "hostIp": "127.0.0.1",
  "createdAt": "2025-03-28T10:30:00",
  "playerCount": 3
}
```

### 玩家 (Player)

玩家是房间中的参与者，包含玩家 ID、昵称、IP、端口等信息。

```json
{
  "id": "玩家唯一ID",
  "nickname": "玩家昵称",
  "ip": "127.0.0.1",
  "port": 25565,
  "isHost": true,
  "version": "MCT_1.0.0_Windows",
  "joinedAt": "2025-03-28T10:30:00",
  "lastHeartbeat": "2025-03-28T10:40:00"
}
```

### API 响应格式

所有 API 返回统一的响应格式：

```json
{
  "success": true,
  "message": "操作描述",
  "data": { ... }
}
```

## 业务流程

### 房主流程

1. **创建房间** - 调用 `POST /api/room/create`
2. **获取玩家列表** - 调用 `GET /api/room/{roomCode}/player/list`
3. **踢出玩家** - 调用 `POST /api/room/{roomCode}/player/kick`
4. **关闭房间** - 调用 `POST /api/room/{roomCode}/close`

### 房客流程

1. **加入房间** - 调用 `POST /api/room/{roomCode}/player/join`
2. **发送心跳** - 每 30 秒调用 `POST /api/room/{roomCode}/player/heartbeat`
3. **离开房间** - 调用 `POST /api/room/{roomCode}/player/{playerId}/leave`

## 错误处理

常见错误信息：

| 错误信息 | 说明 |
|----------|------|
| `房间不存在` | 房间代码错误或房间已关闭 |
| `房间已满` | 房间达到最大玩家数限制 |
| `玩家不存在` | 玩家 ID 错误或玩家已离开 |
| `不能踢出房主` | 尝试踢出房主 |

---

如需更多帮助，请访问 [获取支持](/quick-start/gethelp) 页面。
