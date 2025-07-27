# 快速开始

此教程将帮助您快速开始联机

## Getting Started

### 准备工作

下载MinecraftConnectTool最新版本  
[DOWNLOADLink/点此下载](https://github.com/MCZLF/MinecraftConnectTool/releases/latest)

```bash
# 无需 npm，直接运行可执行文件
# Windows 双击 MinecraftConnectTool.exe
# macOS 双击 MinecraftConnectTool.app
# Linux 终端运行 ./MinecraftConnectTool
```

### Basic Setup

首次启动会自动下载核心，成功后：

1. 主机点击“开启联机房间”获取提示码  
2. 进入单人存档 → ESC → “对局域网开放” → 记下端口号  
3. 将提示码+端口号发给好友

好友端：

1. 输入提示码和端口号 → 点击“加入联机房间”  
2. 复制生成的 `127.0.0.1:xxxxx` 地址  
3. Minecraft 多人游戏 → 直接连接该地址即可

### Configuration

如需手动更新核心，可在工具右上角点击“下载核心”。

## Advanced Features

### 自定义端口映射

若默认端口冲突，可在设置中手动指定本地端口范围。

### 网络诊断

工具内置“网络诊断”按钮，一键检测 NAT 类型与延迟。

### 日志查看

点击“打开日志”即可查看实时连接日志，方便排查问题。

## Deployment

### 本地局域网

确保所有玩家处于同一局域网即可直连，无需公网 IP。

### 公网 P2P

工具会自动尝试 NAT 穿透，成功率取决于双方网络环境。

### 云服务器中继

若 P2P 失败，可自建 frp 中继或使用公共中继节点（见群公告）。

## Best Practices

### 文件组织

```
MinecraftConnectTool/
├── MinecraftConnectTool.exe   # 主程序
├── core/                      # 核心文件（自动下载）
├── logs/                      # 运行日志
└── config.json                # 用户配置
```

### 导航结构

- 主界面：一键开启/加入房间  
- 设置页：端口、日志、更新  
- 帮助页：常见问题与群链接

### 内容规范

- 开启房间后 **立即** 记录提示码与端口  
- 建议每次联机前 **重启工具** 以获得最新核心  
- 遇到连接问题先查看日志，再带截图进群提问
