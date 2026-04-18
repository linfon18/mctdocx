# MCTRoomListService Android 接入文档

本文档指导 Android 客户端如何接入 MCTListServer 玩家管理服务。

## 概述

**服务器地址:** `http://127.0.0.1:30147` (开发环境)

**协议:** HTTP REST API

**数据格式:** JSON

---

## 核心功能

1. **房主创建房间** - 创建玩家管理房间
2. **房客加入房间** - 加入已有房间
3. **获取玩家列表** - 查看房间内所有玩家
4. **踢出玩家** - 房主踢出指定玩家
5. **心跳检测** - 保持连接并检测被踢状态
6. **离开房间** - 主动离开房间

---

## 依赖配置

在 `build.gradle` 中添加 Retrofit 依赖：

```kotlin
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

---

## 数据模型

### Player (玩家)

```kotlin
data class Player(
    val id: String,           // 玩家唯一ID
    val nickname: String,     // 玩家昵称
    val ip: String,           // IP地址
    val port: Int,            // 端口号
    val isHost: Boolean,      // 是否房主
    val version: String,      // MCT版本信息
    val joinedAt: String,     // 加入时间 (ISO 8601格式)
    val lastHeartbeat: String // 最后心跳时间
)
```

### Room (房间)

```kotlin
data class Room(
    val roomCode: String,     // 房间代码
    val hostIp: String,       // 房主IP
    val createdAt: String,    // 创建时间
    val playerCount: Int      // 玩家数量
)
```

### API 响应

```kotlin
data class ApiResponse<T>(
    val success: Boolean,     // 是否成功
    val message: String,      // 消息描述
    val data: T?              // 响应数据
)
```

---

## API 详细说明

### 1. 创建房间 (房主)

**用途:** 房主开启联机时调用

```kotlin
@POST("/api/room/create")
suspend fun createRoom(
    @Body request: CreateRoomRequest
): ApiResponse<CreateRoomResponse>
```

**请求体:**

```kotlin
data class CreateRoomRequest(
    val roomCode: String,  // 房间代码 (如: P2P的端口或Link的提示码)
    val hostIp: String     // 房主IP地址
)
```

**响应:**

```kotlin
data class CreateRoomResponse(
    val roomCode: String,   // 房间代码
    val hostPlayerId: String // 房主玩家ID (用于后续心跳)
)
```

**完整示例代码:**

```kotlin
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface RoomApi {
    @POST("/api/room/create")
    suspend fun createRoom(@Body request: CreateRoomRequest): ApiResponse<CreateRoomResponse>
}

// 创建 Retrofit 实例
val retrofit = Retrofit.Builder()
    .baseUrl("http://127.0.0.1:30147/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val roomApi = retrofit.create(RoomApi::class.java)

// 调用示例
suspend fun createRoomAsHost(roomCode: String, hostIp: String) {
    try {
        val request = CreateRoomRequest(roomCode, hostIp)
        val response = roomApi.createRoom(request)
        
        if (response.success) {
            val hostPlayerId = response.data?.hostPlayerId
            // 保存 hostPlayerId，用于后续心跳
            println("房间创建成功，房主ID: $hostPlayerId")
        } else {
            println("创建失败: ${response.message}")
        }
    } catch (e: Exception) {
        println("网络错误: ${e.message}")
    }
}
```

---

### 2. 加入房间 (房客)

**用途:** 房客加入联机房间时调用

```kotlin
@POST("/api/room/{roomCode}/player/join")
suspend fun joinRoom(
    @Path("roomCode") roomCode: String,
    @Body request: JoinRoomRequest
): ApiResponse<Player>
```

**请求体:**

```kotlin
data class JoinRoomRequest(
    val nickname: String,  // 玩家昵称
    val ip: String,        // 玩家IP
    val port: Int          // 端口号 (Link模式可传0)
)
```

**示例代码:**

```kotlin
interface PlayerApi {
    @POST("/api/room/{roomCode}/player/join")
    suspend fun joinRoom(
        @Path("roomCode") roomCode: String,
        @Body request: JoinRoomRequest
    ): ApiResponse<Player>
}

// 调用示例
suspend fun joinRoomAsPlayer(roomCode: String, nickname: String, ip: String, port: Int) {
    try {
        val playerApi = retrofit.create(PlayerApi::class.java)
        val request = JoinRoomRequest(nickname, ip, port)
        val response = playerApi.joinRoom(roomCode, request)
        
        if (response.success) {
            val player = response.data
            // 保存 player.id，用于后续心跳和离开
            println("加入成功，玩家ID: ${player?.id}")
        } else {
            println("加入失败: ${response.message}")
        }
    } catch (e: Exception) {
        println("网络错误: ${e.message}")
    }
}
```

---

### 3. 获取玩家列表

**用途:** 显示房间内的所有玩家

```kotlin
@GET("/api/room/{roomCode}/player/list")
suspend fun getPlayerList(
    @Path("roomCode") roomCode: String
): ApiResponse<List<Player>>
```

**示例代码:**

```kotlin
interface PlayerApi {
    @GET("/api/room/{roomCode}/player/list")
    suspend fun getPlayerList(@Path("roomCode") roomCode: String): ApiResponse<List<Player>>
}

// 调用示例
suspend fun fetchPlayerList(roomCode: String): List<Player> {
    return try {
        val playerApi = retrofit.create(PlayerApi::class.java)
        val response = playerApi.getPlayerList(roomCode)
        
        if (response.success) {
            response.data ?: emptyList()
        } else {
            emptyList()
        }
    } catch (e: Exception) {
        emptyList()
    }
}
```

---

### 4. 踢出玩家 (仅房主)

**用途:** 房主踢出指定玩家

```kotlin
@POST("/api/room/{roomCode}/player/kick")
suspend fun kickPlayer(
    @Path("roomCode") roomCode: String,
    @Body request: KickRequest
): ApiResponse<Unit>
```

**请求体:**

```kotlin
data class KickRequest(
    val playerId: String  // 要踢出的玩家ID
)
```

**示例代码:**

```kotlin
interface PlayerApi {
    @POST("/api/room/{roomCode}/player/kick")
    suspend fun kickPlayer(
        @Path("roomCode") roomCode: String,
        @Body request: KickRequest
    ): ApiResponse<Unit>
}

// 调用示例
suspend fun kickPlayer(roomCode: String, playerId: String) {
    try {
        val playerApi = retrofit.create(PlayerApi::class.java)
        val request = KickRequest(playerId)
        val response = playerApi.kickPlayer(roomCode, request)
        
        if (response.success) {
            println("踢出成功")
        } else {
            println("踢出失败: ${response.message}")
        }
    } catch (e: Exception) {
        println("网络错误: ${e.message}")
    }
}
```

---

### 5. 心跳检测

**用途:** 保持连接活跃，检测是否被踢出

**重要:** 必须每30秒发送一次心跳

```kotlin
@POST("/api/room/{roomCode}/player/heartbeat")
suspend fun sendHeartbeat(
    @Path("roomCode") roomCode: String,
    @Body request: HeartbeatRequest
): ApiResponse<HeartbeatResponse>
```

**请求体:**

```kotlin
data class HeartbeatRequest(
    val playerId: String  // 当前玩家ID
)
```

**响应:**

```kotlin
data class HeartbeatResponse(
    val isKicked: Boolean  // 是否被踢出
)
```

**心跳管理器示例:**

```kotlin
import kotlinx.coroutines.*

// 心跳管理器
class HeartbeatManager(
    private val playerApi: PlayerApi,
    private val roomCode: String,
    private val playerId: String
) {
    private var job: Job? = null
    
    fun start(scope: CoroutineScope, onKicked: () -> Unit) {
        job = scope.launch(Dispatchers.IO) {
            while (isActive) {
                try {
                    val request = HeartbeatRequest(playerId)
                    val response = playerApi.sendHeartbeat(roomCode, request)
                    
                    if (response.success) {
                        val isKicked = response.data?.isKicked ?: false
                        if (isKicked) {
                            // 被踢出，回调通知
                            withContext(Dispatchers.Main) {
                                onKicked()
                            }
                            break
                        }
                    }
                } catch (e: Exception) {
                    println("心跳失败: ${e.message}")
                }
                
                // 每30秒发送一次
                delay(30000)
            }
        }
    }
    
    fun stop() {
        job?.cancel()
        job = null
    }
}

// 使用示例
class GameActivity : AppCompatActivity() {
    private lateinit var heartbeatManager: HeartbeatManager
    
    fun startHeartbeat(roomCode: String, playerId: String) {
        val playerApi = retrofit.create(PlayerApi::class.java)
        heartbeatManager = HeartbeatManager(playerApi, roomCode, playerId)
        
        heartbeatManager.start(lifecycleScope) {
            // 被踢出，停止游戏
            runOnUiThread {
                Toast.makeText(this, "你已被踢出房间", Toast.LENGTH_LONG).show()
                stopGame()
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        heartbeatManager.stop()
    }
}
```

---

### 6. 离开房间

**用途:** 主动离开房间 (关闭联机时调用)

```kotlin
@POST("/api/room/{roomCode}/player/{playerId}/leave")
suspend fun leaveRoom(
    @Path("roomCode") roomCode: String,
    @Path("playerId") playerId: String
): ApiResponse<Unit>
```

**示例代码:**

```kotlin
interface PlayerApi {
    @POST("/api/room/{roomCode}/player/{playerId}/leave")
    suspend fun leaveRoom(
        @Path("roomCode") roomCode: String,
        @Path("playerId") playerId: String
    ): ApiResponse<Unit>
}

// 调用示例
suspend fun leaveRoom(roomCode: String, playerId: String) {
    try {
        val playerApi = retrofit.create(PlayerApi::class.java)
        val response = playerApi.leaveRoom(roomCode, playerId)
        
        if (response.success) {
            println("离开成功")
        }
    } catch (e: Exception) {
        println("网络错误: ${e.message}")
    }
}
```

---

### 7. 关闭房间 (房主)

**用途:** 房主关闭联机时调用

```kotlin
@POST("/api/room/{roomCode}/close")
suspend fun closeRoom(
    @Path("roomCode") roomCode: String
): ApiResponse<Unit>
```

**示例代码:**

```kotlin
interface RoomApi {
    @POST("/api/room/{roomCode}/close")
    suspend fun closeRoom(@Path("roomCode") roomCode: String): ApiResponse<Unit>
}

// 调用示例
suspend fun closeRoom(roomCode: String) {
    try {
        val roomApi = retrofit.create(RoomApi::class.java)
        val response = roomApi.closeRoom(roomCode)
        
        if (response.success) {
            println("房间关闭成功")
        }
    } catch (e: Exception) {
        println("网络错误: ${e.message}")
    }
}
```

---

## 完整流程示例

### P2P 模式房主流程

```kotlin
class P2PHostManager(
    private val roomApi: RoomApi,
    private val playerApi: PlayerApi
) {
    private var roomCode: String? = null
    private var hostPlayerId: String? = null
    private var heartbeatManager: HeartbeatManager? = null
    
    // 1. 开启联机时调用
    suspend fun startRoom(port: String, hostIp: String): Boolean {
        roomCode = port
        
        return try {
            val request = CreateRoomRequest(port, hostIp)
            val response = roomApi.createRoom(request)
            
            if (response.success) {
                hostPlayerId = response.data?.hostPlayerId
                // 启动心跳
                hostPlayerId?.let { playerId ->
                    heartbeatManager = HeartbeatManager(playerApi, port, playerId)
                    heartbeatManager?.start(GlobalScope) {
                        // 房主被踢 (正常情况下不会发生)
                    }
                }
                true
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }
    }
    
    // 2. 获取玩家列表
    suspend fun getPlayerList(): List<Player> {
        return roomCode?.let { code ->
            try {
                val response = playerApi.getPlayerList(code)
                if (response.success) response.data ?: emptyList() else emptyList()
            } catch (e: Exception) {
                emptyList()
            }
        } ?: emptyList()
    }
    
    // 3. 踢出玩家
    suspend fun kickPlayer(playerId: String): Boolean {
        return roomCode?.let { code ->
            try {
                val request = KickRequest(playerId)
                val response = playerApi.kickPlayer(code, request)
                response.success
            } catch (e: Exception) {
                false
            }
        } ?: false
    }
    
    // 4. 关闭联机时调用
    suspend fun stopRoom() {
        heartbeatManager?.stop()
        
        roomCode?.let { code ->
            try {
                roomApi.closeRoom(code)
            } catch (e: Exception) {
                // 忽略错误
            }
        }
        
        roomCode = null
        hostPlayerId = null
    }
}
```

### P2P/Link 模式房客流程

```kotlin
class PlayerManager(
    private val playerApi: PlayerApi
) {
    private var roomCode: String? = null
    private var playerId: String? = null
    private var heartbeatManager: HeartbeatManager? = null
    var onKicked: (() -> Unit)? = null
    
    // 1. 加入联机时调用
    suspend fun joinRoom(
        code: String, 
        nickname: String, 
        ip: String, 
        port: Int
    ): Boolean {
        roomCode = code
        
        return try {
            val request = JoinRoomRequest(nickname, ip, port)
            val response = playerApi.joinRoom(code, request)
            
            if (response.success) {
                playerId = response.data?.id
                // 启动心跳
                playerId?.let { id ->
                    heartbeatManager = HeartbeatManager(playerApi, code, id)
                    heartbeatManager?.start(GlobalScope) {
                        // 被踢出回调
                        onKicked?.invoke()
                    }
                }
                true
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }
    }
    
    // 2. 获取玩家列表
    suspend fun getPlayerList(): List<Player> {
        return roomCode?.let { code ->
            try {
                val response = playerApi.getPlayerList(code)
                if (response.success) response.data ?: emptyList() else emptyList()
            } catch (e: Exception) {
                emptyList()
            }
        } ?: emptyList()
    }
    
    // 3. 离开联机时调用
    suspend fun leaveRoom() {
        heartbeatManager?.stop()
        
        roomCode?.let { code ->
            playerId?.let { id ->
                try {
                    playerApi.leaveRoom(code, id)
                } catch (e: Exception) {
                    // 忽略错误
                }
            }
        }
        
        roomCode = null
        playerId = null
    }
}
```

---

## 错误处理

所有 API 返回统一格式的响应：

```kotlin
data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T?
)
```

### 常见错误

| 错误信息 | 说明 |
|----------|------|
| `房间不存在` | 房间代码错误或房间已关闭 |
| `房间已满` | 房间达到最大玩家数限制 |
| `玩家不存在` | 玩家 ID 错误或玩家已离开 |
| `不能踢出房主` | 尝试踢出房主 |

---

如需更多帮助，请访问 [获取支持](/quick-start/gethelp) 页面。
