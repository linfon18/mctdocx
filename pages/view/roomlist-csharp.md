# MCTRoomListService C# 客户端接入文档

本文档指导其他 MCT (MinecraftConnectTool) 客户端如何接入 MCTListServer 玩家管理服务。

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

## 快速开始

### 1. 安装依赖

```bash
dotnet add package System.Net.Http.Json
```

或使用 NuGet 包管理器安装 `System.Net.Http.Json`。

### 2. 基础配置

```csharp
public static class MCTListServerConfig
{
    public const string BaseUrl = "http://127.0.0.1:30147";
    public static readonly TimeSpan HeartbeatInterval = TimeSpan.FromSeconds(30);
    public static readonly TimeSpan HttpTimeout = TimeSpan.FromSeconds(10);
}
```

---

## 数据模型

```csharp
using System;
using System.Text.Json.Serialization;

namespace MCTClient.Models
{
    /// <summary>
    /// API 响应包装
    /// </summary>
    public class ApiResponse<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }

    /// <summary>
    /// 玩家信息
    /// </summary>
    public class Player
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("nickname")]
        public string Nickname { get; set; } = string.Empty;

        [JsonPropertyName("ip")]
        public string Ip { get; set; } = string.Empty;

        [JsonPropertyName("port")]
        public int Port { get; set; }

        [JsonPropertyName("isHost")]
        public bool IsHost { get; set; }

        [JsonPropertyName("version")]
        public string Version { get; set; } = string.Empty;

        [JsonPropertyName("joinedAt")]
        public DateTime JoinedAt { get; set; }

        [JsonPropertyName("lastHeartbeat")]
        public DateTime LastHeartbeat { get; set; }
    }

    /// <summary>
    /// 房间信息
    /// </summary>
    public class Room
    {
        [JsonPropertyName("roomCode")]
        public string RoomCode { get; set; } = string.Empty;

        [JsonPropertyName("hostIp")]
        public string HostIp { get; set; } = string.Empty;

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("playerCount")]
        public int PlayerCount { get; set; }
    }

    // 请求模型
    public class CreateRoomRequest
    {
        [JsonPropertyName("roomCode")]
        public string RoomCode { get; set; } = string.Empty;

        [JsonPropertyName("hostIp")]
        public string HostIp { get; set; } = string.Empty;
    }

    public class CreateRoomResponse
    {
        [JsonPropertyName("roomCode")]
        public string RoomCode { get; set; } = string.Empty;

        [JsonPropertyName("hostPlayerId")]
        public string HostPlayerId { get; set; } = string.Empty;
    }

    public class JoinRoomRequest
    {
        [JsonPropertyName("nickname")]
        public string Nickname { get; set; } = string.Empty;

        [JsonPropertyName("ip")]
        public string Ip { get; set; } = string.Empty;

        [JsonPropertyName("port")]
        public int Port { get; set; }
    }

    public class KickRequest
    {
        [JsonPropertyName("playerId")]
        public string PlayerId { get; set; } = string.Empty;
    }

    public class HeartbeatRequest
    {
        [JsonPropertyName("playerId")]
        public string PlayerId { get; set; } = string.Empty;
    }

    public class HeartbeatResponse
    {
        [JsonPropertyName("isKicked")]
        public bool IsKicked { get; set; }
    }
}
```

---

## HTTP 客户端封装

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using MCTClient.Models;

namespace MCTClient.Services
{
    public class MCTListServerClient : IDisposable
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public MCTListServerClient(string baseUrl = MCTListServerConfig.BaseUrl)
        {
            _baseUrl = baseUrl.TrimEnd('/');
            _httpClient = new HttpClient
            {
                Timeout = MCTListServerConfig.HttpTimeout
            };
        }

        #region 房间管理

        /// <summary>
        /// 创建房间 (房主)
        /// </summary>
        public async Task<ApiResponse<CreateRoomResponse>?> CreateRoomAsync(
            string roomCode, 
            string hostIp,
            CancellationToken cancellationToken = default)
        {
            var request = new CreateRoomRequest
            {
                RoomCode = roomCode,
                HostIp = hostIp
            };

            var response = await _httpClient.PostAsJsonAsync(
                $"{_baseUrl}/api/room/create", 
                request, 
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<CreateRoomResponse>>(cancellationToken: cancellationToken);
        }

        /// <summary>
        /// 获取房间信息
        /// </summary>
        public async Task<ApiResponse<Room>?> GetRoomAsync(
            string roomCode,
            CancellationToken cancellationToken = default)
        {
            return await _httpClient.GetFromJsonAsync<ApiResponse<Room>>(
                $"{_baseUrl}/api/room/{roomCode}",
                cancellationToken);
        }

        /// <summary>
        /// 关闭房间 (房主)
        /// </summary>
        public async Task<ApiResponse<object>?> CloseRoomAsync(
            string roomCode,
            CancellationToken cancellationToken = default)
        {
            var response = await _httpClient.PostAsync(
                $"{_baseUrl}/api/room/{roomCode}/close",
                null,
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<object>>(cancellationToken: cancellationToken);
        }

        #endregion

        #region 玩家管理

        /// <summary>
        /// 加入房间 (房客)
        /// </summary>
        public async Task<ApiResponse<Player>?> JoinRoomAsync(
            string roomCode,
            string nickname,
            string ip,
            int port,
            CancellationToken cancellationToken = default)
        {
            var request = new JoinRoomRequest
            {
                Nickname = nickname,
                Ip = ip,
                Port = port
            };

            var response = await _httpClient.PostAsJsonAsync(
                $"{_baseUrl}/api/room/{roomCode}/player/join",
                request,
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<Player>>(cancellationToken: cancellationToken);
        }

        /// <summary>
        /// 获取玩家列表
        /// </summary>
        public async Task<ApiResponse<List<Player>>?> GetPlayerListAsync(
            string roomCode,
            CancellationToken cancellationToken = default)
        {
            return await _httpClient.GetFromJsonAsync<ApiResponse<List<Player>>>(
                $"{_baseUrl}/api/room/{roomCode}/player/list",
                cancellationToken);
        }

        /// <summary>
        /// 踢出玩家 (房主)
        /// </summary>
        public async Task<ApiResponse<object>?> KickPlayerAsync(
            string roomCode,
            string playerId,
            CancellationToken cancellationToken = default)
        {
            var request = new KickRequest { PlayerId = playerId };

            var response = await _httpClient.PostAsJsonAsync(
                $"{_baseUrl}/api/room/{roomCode}/player/kick",
                request,
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<object>>(cancellationToken: cancellationToken);
        }

        /// <summary>
        /// 离开房间
        /// </summary>
        public async Task<ApiResponse<object>?> LeaveRoomAsync(
            string roomCode,
            string playerId,
            CancellationToken cancellationToken = default)
        {
            var response = await _httpClient.PostAsync(
                $"{_baseUrl}/api/room/{roomCode}/player/{playerId}/leave",
                null,
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<object>>(cancellationToken: cancellationToken);
        }

        /// <summary>
        /// 发送心跳
        /// </summary>
        public async Task<ApiResponse<HeartbeatResponse>?> SendHeartbeatAsync(
            string roomCode,
            string playerId,
            CancellationToken cancellationToken = default)
        {
            var request = new HeartbeatRequest { PlayerId = playerId };

            var response = await _httpClient.PostAsJsonAsync(
                $"{_baseUrl}/api/room/{roomCode}/player/heartbeat",
                request,
                cancellationToken);

            return await response.Content.ReadFromJsonAsync<ApiResponse<HeartbeatResponse>>(cancellationToken: cancellationToken);
        }

        #endregion

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}
```

---

## 心跳管理器

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;
using MCTClient.Models;
using MCTClient.Services;

namespace MCTClient.Managers
{
    /// <summary>
    /// 心跳管理器 - 自动维护与服务器的连接
    /// </summary>
    public class HeartbeatManager : IDisposable
    {
        private readonly MCTListServerClient _client;
        private readonly string _roomCode;
        private readonly string _playerId;
        private readonly TimeSpan _interval;
        private CancellationTokenSource? _cts;
        private Task? _heartbeatTask;

        public event EventHandler? Kicked;
        public event EventHandler<Exception>? Error;

        public bool IsRunning => _heartbeatTask != null && !_heartbeatTask.IsCompleted;

        public HeartbeatManager(
            MCTListServerClient client,
            string roomCode,
            string playerId,
            TimeSpan? interval = null)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _roomCode = roomCode ?? throw new ArgumentNullException(nameof(roomCode));
            _playerId = playerId ?? throw new ArgumentNullException(nameof(playerId));
            _interval = interval ?? MCTListServerConfig.HeartbeatInterval;
        }

        /// <summary>
        /// 开始心跳
        /// </summary>
        public void Start()
        {
            if (IsRunning) return;

            _cts = new CancellationTokenSource();
            _heartbeatTask = RunHeartbeatAsync(_cts.Token);
        }

        /// <summary>
        /// 停止心跳
        /// </summary>
        public void Stop()
        {
            _cts?.Cancel();
            _cts?.Dispose();
            _cts = null;
        }

        private async Task RunHeartbeatAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var response = await _client.SendHeartbeatAsync(_roomCode, _playerId, cancellationToken);

                    if (response?.Success == true && response.Data?.IsKicked == true)
                    {
                        Kicked?.Invoke(this, EventArgs.Empty);
                        break;
                    }
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Error?.Invoke(this, ex);
                }

                try
                {
                    await Task.Delay(_interval, cancellationToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }
        }

        public void Dispose()
        {
            Stop();
        }
    }
}
```

---

## 玩家列表服务 (高级封装)

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using MCTClient.Managers;
using MCTClient.Models;
using MCTClient.Services;

namespace MCTClient.Services
{
    /// <summary>
    /// 玩家列表服务 - 高级封装，包含自动刷新
    /// </summary>
    public class PlayerListService : IDisposable
    {
        private readonly MCTListServerClient _client;
        private HeartbeatManager? _heartbeatManager;
        private System.Timers.Timer? _refreshTimer;

        public string? RoomCode { get; private set; }
        public string? PlayerId { get; private set; }
        public bool IsHost { get; private set; }
        public bool IsConnected => !string.IsNullOrEmpty(PlayerId);

        public List<Player> Players { get; private set; } = new();

        public event EventHandler<List<Player>>? PlayersChanged;
        public event EventHandler? Kicked;
        public event EventHandler<string>? Error;

        public PlayerListService(string baseUrl = MCTListServerConfig.BaseUrl)
        {
            _client = new MCTListServerClient(baseUrl);
        }

        #region 房主操作

        /// <summary>
        /// 创建房间 (房主)
        /// </summary>
        public async Task<bool> CreateRoomAsync(string roomCode, string hostIp)
        {
            try
            {
                var response = await _client.CreateRoomAsync(roomCode, hostIp);

                if (response?.Success == true)
                {
                    RoomCode = roomCode;
                    PlayerId = response.Data?.HostPlayerId;
                    IsHost = true;

                    // 启动心跳
                    StartHeartbeat();
                    // 启动自动刷新
                    StartAutoRefresh();

                    return true;
                }

                Error?.Invoke(this, response?.Message ?? "创建房间失败");
                return false;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"网络错误: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// 关闭房间 (房主)
        /// </summary>
        public async Task<bool> CloseRoomAsync()
        {
            if (!IsHost || string.IsNullOrEmpty(RoomCode))
                return false;

            try
            {
                StopHeartbeat();
                StopAutoRefresh();

                var response = await _client.CloseRoomAsync(RoomCode);
                
                RoomCode = null;
                PlayerId = null;
                IsHost = false;
                Players.Clear();

                return response?.Success == true;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"关闭房间失败: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// 踢出玩家 (房主)
        /// </summary>
        public async Task<bool> KickPlayerAsync(string playerId)
        {
            if (!IsHost || string.IsNullOrEmpty(RoomCode))
                return false;

            try
            {
                var response = await _client.KickPlayerAsync(RoomCode, playerId);
                
                if (response?.Success == true)
                {
                    await RefreshPlayerListAsync();
                    return true;
                }

                Error?.Invoke(this, response?.Message ?? "踢出失败");
                return false;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"踢出失败: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region 房客操作

        /// <summary>
        /// 加入房间 (房客)
        /// </summary>
        public async Task<bool> JoinRoomAsync(string roomCode, string nickname, string ip, int port)
        {
            try
            {
                var response = await _client.JoinRoomAsync(roomCode, nickname, ip, port);

                if (response?.Success == true)
                {
                    RoomCode = roomCode;
                    PlayerId = response.Data?.Id;
                    IsHost = false;

                    // 启动心跳
                    StartHeartbeat();
                    // 启动自动刷新
                    StartAutoRefresh();

                    return true;
                }

                Error?.Invoke(this, response?.Message ?? "加入房间失败");
                return false;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"网络错误: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// 离开房间
        /// </summary>
        public async Task<bool> LeaveRoomAsync()
        {
            if (string.IsNullOrEmpty(RoomCode) || string.IsNullOrEmpty(PlayerId))
                return false;

            try
            {
                StopHeartbeat();
                StopAutoRefresh();

                var response = await _client.LeaveRoomAsync(RoomCode, PlayerId);
                
                RoomCode = null;
                PlayerId = null;
                IsHost = false;
                Players.Clear();

                return response?.Success == true;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"离开房间失败: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region 公共操作

        /// <summary>
        /// 刷新玩家列表
        /// </summary>
        public async Task<bool> RefreshPlayerListAsync()
        {
            if (string.IsNullOrEmpty(RoomCode))
                return false;

            try
            {
                var response = await _client.GetPlayerListAsync(RoomCode);

                if (response?.Success == true)
                {
                    Players = response.Data ?? new List<Player>();
                    PlayersChanged?.Invoke(this, Players);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                Error?.Invoke(this, $"刷新列表失败: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region 私有方法

        private void StartHeartbeat()
        {
            if (string.IsNullOrEmpty(RoomCode) || string.IsNullOrEmpty(PlayerId))
                return;

            _heartbeatManager = new HeartbeatManager(_client, RoomCode, PlayerId);
            _heartbeatManager.Kicked += (s, e) => Kicked?.Invoke(this, EventArgs.Empty);
            _heartbeatManager.Error += (s, ex) => Error?.Invoke(this, $"心跳错误: {ex.Message}");
            _heartbeatManager.Start();
        }

        private void StopHeartbeat()
        {
            _heartbeatManager?.Dispose();
            _heartbeatManager = null;
        }

        private void StartAutoRefresh(int intervalMs = 5000)
        {
            _refreshTimer = new System.Timers.Timer(intervalMs);
            _refreshTimer.Elapsed += async (s, e) => await RefreshPlayerListAsync();
            _refreshTimer.AutoReset = true;
            _refreshTimer.Start();
        }

        private void StopAutoRefresh()
        {
            _refreshTimer?.Stop();
            _refreshTimer?.Dispose();
            _refreshTimer = null;
        }

        #endregion

        public void Dispose()
        {
            StopHeartbeat();
            StopAutoRefresh();
            _client.Dispose();
        }
    }
}
```

---

## 使用示例

### 基础使用示例

```csharp
using System;
using System.Threading.Tasks;
using MCTClient.Services;

class Program
{
    static async Task Main(string[] args)
    {
        // 创建客户端
        using var client = new MCTListServerClient();

        // 创建房间 (房主)
        var createResponse = await client.CreateRoomAsync("TEST-ROOM-001", "127.0.0.1");
        if (createResponse?.Success == true)
        {
            Console.WriteLine($"房间创建成功，房主ID: {createResponse.Data.HostPlayerId}");
            
            // 其他玩家加入
            var joinResponse = await client.JoinRoomAsync("TEST-ROOM-001", "玩家1", "127.0.0.1", 25565);
            if (joinResponse?.Success == true)
            {
                Console.WriteLine($"加入成功，玩家ID: {joinResponse.Data.Id}");
            }

            // 获取玩家列表
            var listResponse = await client.GetPlayerListAsync("TEST-ROOM-001");
            if (listResponse?.Success == true)
            {
                foreach (var player in listResponse.Data)
                {
                    Console.WriteLine($"- {player.Nickname} ({player.Ip}:{player.Port})");
                }
            }
        }
    }
}
```

### 高级封装使用示例

```csharp
using System;
using System.Threading.Tasks;
using MCTClient.Services;

class GameClient
{
    private readonly PlayerListService _playerListService;

    public GameClient()
    {
        _playerListService = new PlayerListService();
        
        // 订阅事件
        _playerListService.PlayersChanged += (s, players) =>
        {
            Console.WriteLine($"玩家列表更新，当前 {players.Count} 人");
        };
        
        _playerListService.Kicked += (s, e) =>
        {
            Console.WriteLine("你已被踢出房间！");
        };
        
        _playerListService.Error += (s, message) =>
        {
            Console.WriteLine($"错误: {message}");
        };
    }

    // 房主创建房间
    public async Task<bool> HostGame(string roomCode, string hostIp)
    {
        return await _playerListService.CreateRoomAsync(roomCode, hostIp);
    }

    // 房客加入游戏
    public async Task<bool> JoinGame(string roomCode, string nickname, string ip, int port)
    {
        return await _playerListService.JoinRoomAsync(roomCode, nickname, ip, port);
    }

    // 踢出玩家
    public async Task<bool> KickPlayer(string playerId)
    {
        return await _playerListService.KickPlayerAsync(playerId);
    }

    // 离开游戏
    public async Task LeaveGame()
    {
        await _playerListService.LeaveRoomAsync();
    }
}
```

---

## 错误处理

所有 API 返回统一格式的响应：

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
}
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
