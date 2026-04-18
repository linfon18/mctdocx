# 0.0.7 升级指南

<style>
.warning-box {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left: 5px solid #f39c12;
  padding: 16px 20px;
  border-radius: 8px;
  margin: 20px 0;
}
.warning-box strong {
  color: #d35400;
}
.step-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  border: 1px solid #e9ecef;
}
.step-box h3 {
  margin-top: 0;
  color: #2c3e50;
}
.code-block {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
}
.code-block .comment {
  color: #75715e;
}
.code-block .command {
  color: #66d9ef;
}
.dotnet-btn {
  display: inline-block;
  margin: 12px 0;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #512bd4 0%, #7c4dff 100%);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(81, 43, 212, 0.3);
}
.dotnet-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(81, 43, 212, 0.4);
}
</style>

## 0.0.7 系列用户须知

<div class="warning-box">
  <strong>⚠️ 重要提示</strong><br>
  对于所有桌面端操作系统，您必须先安装 <strong>.NET 8 Runtime</strong> 作为运行框架（MCT 不作分发）。
</div>

<a class="dotnet-btn" href="https://dotnet.microsoft.com/zh-cn/download/dotnet/8.0" target="_blank">下载 .NET 8 Runtime</a>

---

## 启动指南

### 1. Windows 启动

直接双击运行 `.exe` 文件即可。

<div class="step-box">
<h3>🪟 Windows 用户</h3>
<p>无需额外操作，安装 .NET 8 Runtime 后直接启动程序。</p>
</div>

---

### 2. Linux 用户启动

<div class="step-box">
<h3>🐧 Linux 用户</h3>
<p>切换到终端，cd 到当前目录，执行以下命令：</p>
<div class="code-block">
<span class="comment"># 赋予执行权限</span><br>
<span class="command">chmod +x MinecraftConnectTool</span><br><br>
<span class="comment"># 启动程序</span><br>
<span class="command">./MinecraftConnectTool</span>
</div>
</div>

---

### 3. Mac 用户启动

<div class="step-box">
<h3>🍎 macOS 用户</h3>
<p>启动终端，cd 到当前目录，执行以下命令：</p>
<div class="code-block">
<span class="comment"># 赋予执行权限</span><br>
<span class="command">chmod +x MinecraftConnectTool</span><br><br>
<span class="comment"># 移除隔离属性（解决"无法打开"提示）</span><br>
<span class="command">xattr -d com.apple.quarantine MinecraftConnectTool</span><br><br>
<span class="comment"># 重新签名（解决签名验证问题）</span><br>
<span class="command">codesign --sign - --force --preserve-metadata=entitlements,flags,runtime MinecraftConnectTool</span><br><br>
<span class="comment"># 启动程序</span><br>
<span class="command">./MinecraftConnectTool</span>
</div>
<p><em>注：后续版本将变更为 .dmg 直装模式，简化安装流程。</em></p>
</div>

---

### 4. Android 用户

<div class="step-box">
<h3>📱 Android 用户</h3>
<p>直接安装 APK 文件，无需任何额外操作。</p>
</div>

---

## 常见问题

**Q: 为什么需要单独安装 .NET 8 Runtime？**  
A: 为了减小程序包体积，MCT 0.0.7 系列不再内置运行时，需要用户自行安装。

**Q: 如何确认 .NET 8 Runtime 是否安装成功？**  
A: 打开终端/命令提示符，输入 `dotnet --version`，如果显示版本号（如 8.0.xxx）则表示安装成功。

**Q: Mac 上执行命令时提示"Permission denied"怎么办？**  
A: 确保已执行 `chmod +x MinecraftConnectTool` 命令赋予执行权限。

---

如需更多帮助，请访问 [获取支持](/quick-start/gethelp) 页面。
