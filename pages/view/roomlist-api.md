# MCTRoomListService API 参考

服务器地址: `http://127.0.0.1:30147`

Swagger UI: `http://127.0.0.1:30147/swagger`

---

## 房间管理 API

### 1. 创建房间

创建一个新的联机房间。

**请求:**

```http
POST /api/room/create
Content-Type: application/json

{
  "roomCode": "房间代码",
  "hostIp": "房主IP地址"
}
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/create" -Method POST -ContentType "application/json" -Body '{"roomCode": "APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG", "hostIp": "127.0.0.1"}'
```

**响应:**

```json
{
  "success": true,
  "message": "房间创建成功",
  "data": {
    "roomCode": "APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG",
    "hostPlayerId": "房主玩家ID"
  }
}
```

---

### 2. 获取房间信息

获取指定房间的详细信息。

**请求:**

```http
GET /api/room/{roomCode}
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG" -Method GET
```

**响应:**

```json
{
  "success": true,
  "message": "房间信息",
  "data": {
    "roomCode": "APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG",
    "hostIp": "127.0.0.1",
    "createdAt": "2025-03-28T10:30:00",
    "playerCount": 1
  }
}
```

---

### 3. 关闭房间

房主关闭房间。

**请求:**

```http
POST /api/room/{roomCode}/close
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/close" -Method POST
```

**响应:**

```json
{
  "success": true,
  "message": "房间已关闭"
}
```

---

## 玩家管理 API

### 4. 加入房间

玩家加入指定房间。

**请求:**

```http
POST /api/room/{roomCode}/player/join
Content-Type: application/json

{
  "nickname": "玩家昵称",
  "ip": "玩家IP地址",
  "port": 25565
}
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/player/join" -Method POST -ContentType "application/json" -Body '{"nickname": "测试玩家", "ip": "127.0.0.1", "port": 25565}'
```

**响应:**

```json
{
  "success": true,
  "message": "加入成功",
  "data": {
    "playerId": "玩家唯一ID",
    "nickname": "测试玩家",
    "ip": "127.0.0.1",
    "port": 25565,
    "joinedAt": "2025-03-28T10:35:00"
  }
}
```

---

### 5. 获取玩家列表

获取房间内的所有玩家列表。

**请求:**

```http
GET /api/room/{roomCode}/player/list
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/player/list" -Method GET
```

**响应:**

```json
{
  "success": true,
  "message": "玩家列表",
  "data": [
    {
      "id": "玩家ID",
      "nickname": "房主",
      "ip": "127.0.0.1",
      "port": 25565,
      "isHost": true,
      "version": "MCT_1.0.0_Windows",
      "joinedAt": "2025-03-28T10:30:00",
      "lastHeartbeat": "2025-03-28T10:40:00"
    },
    {
      "id": "玩家ID2",
      "nickname": "测试玩家",
      "ip": "127.0.0.1",
      "port": 0,
      "isHost": false,
      "version": "MCT_1.0.0_Windows",
      "joinedAt": "2025-03-28T10:35:00",
      "lastHeartbeat": "2025-03-28T10:40:00"
    }
  ]
}
```

---

### 6. 踢出玩家

房主踢出指定玩家。

**请求:**

```http
POST /api/room/{roomCode}/player/kick
Content-Type: application/json

{
  "playerId": "要踢出的玩家ID"
}
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/player/kick" -Method POST -ContentType "application/json" -Body '{"playerId": "玩家ID"}'
```

**响应:**

```json
{
  "success": true,
  "message": "玩家已被踢出"
}
```

---

### 7. 离开房间

玩家主动离开房间。

**请求:**

```http
POST /api/room/{roomCode}/player/{playerId}/leave
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/player/玩家ID/leave" -Method POST
```

**响应:**

```json
{
  "success": true,
  "message": "已离开房间"
}
```

---

### 8. 心跳检测

保持连接活跃，检测是否被踢出。**必须每 3 秒发送一次。**

**请求:**

```http
POST /api/room/{roomCode}/player/heartbeat
Content-Type: application/json

{
  "playerId": "玩家ID"
}
```

**PowerShell 调用示例:**

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/APADVXNH-14ACRNHP-D6JMAXLIRAEBX7CG/player/heartbeat" -Method POST -ContentType "application/json" -Body '{"playerId": "玩家ID"}'
```

**响应:**

```json
{
  "success": true,
  "message": "心跳正常",
  "data": {
    "isKicked": false
  }
}
```

---

## 完整流程示例

### PowerShell 完整示例

```powershell
# 1. 创建房间
$roomCode = "TEST-ROOM-001"
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/create" -Method POST -ContentType "application/json" -Body "{`"roomCode`": `"$roomCode`", `"hostIp`": `"127.0.0.1`"}"

# 2. 玩家加入
$joinResult = Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/$roomCode/player/join" -Method POST -ContentType "application/json" -Body '{"nickname": "玩家1", "ip": "127.0.0.1", "port": 25565}'
$playerId = $joinResult.data.playerId

# 3. 获取玩家列表
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/$roomCode/player/list" -Method GET

# 4. 发送心跳
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/$roomCode/player/heartbeat" -Method POST -ContentType "application/json" -Body "{`"playerId`": `"$playerId`"}"

# 5. 玩家离开
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/$roomCode/player/$playerId/leave" -Method POST

# 6. 关闭房间
Invoke-RestMethod -Uri "http://127.0.0.1:30147/api/room/$roomCode/close" -Method POST
```

---

## 错误响应

所有 API 在失败时返回统一格式:

```json
{
  "success": false,
  "message": "错误描述",
  "data": null
}
```

### 常见错误信息

| 错误信息 | 说明 |
|----------|------|
| `房间不存在` | 房间代码错误或房间已关闭 |
| `房间已满` | 房间达到最大玩家数限制 |
| `玩家不存在` | 玩家 ID 错误或玩家已离开 |
| `不能踢出房主` | 尝试踢出房主 |

---

## 数据模型

### Room (房间)

| 字段 | 类型 | 说明 |
|------|------|------|
| `roomCode` | string | 房间代码 |
| `hostIp` | string | 房主 IP 地址 |
| `createdAt` | datetime | 创建时间 |
| `playerCount` | int | 玩家数量 |

### Player (玩家)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 玩家唯一 ID |
| `nickname` | string | 玩家昵称 |
| `ip` | string | IP 地址 |
| `port` | int | 端口号 |
| `isHost` | bool | 是否房主 |
| `version` | string | MCT 版本信息 |
| `joinedAt` | datetime | 加入时间 |
| `lastHeartbeat` | datetime | 最后心跳时间 |

### ApiResponse (API 响应)

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | bool | 是否成功 |
| `message` | string | 消息描述 |
| `data` | T | 响应数据 |
