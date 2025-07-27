# 下载中心

<style>
@keyframes neon{0%{box-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 20px #0ff}50%{box-shadow:0 0 10px #0ff,0 0 20px #0ff,0 0 40px #0ff}100%{box-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 20px #0ff}}
.btn-dl{display:inline-flex;align-items:center;gap:8px;margin:12px 0;padding:14px 32px;font-size:18px;font-weight:700;color:#fff;background:linear-gradient(135deg,#00f5ff 0%,#0099ff 100%);border:none;border-radius:50px;text-decoration:none;animation:neon 2s infinite;transition:transform .3s}
.btn-dl:hover{transform:scale(1.05)}
.log-box{background:#0d1117;color:#c9d1d9;padding:16px;border-radius:8px;white-space:pre-wrap;font-family:Consolas,Monaco,"Courier New",monospace;max-height:300px;overflow-y:auto}
</style>

## 🚀 0.0.6 系列（推荐，Win10/11）
- **最新版本号** <span id="v-006">加载中…</span>  
- <a class="btn-dl" href="https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/006/Latest.exe">
  <svg width="20" height="20" fill="currentColor"><path d="M5 20h14v-2H5v2zm7-18L5.5 9.5 7 11l5-5v14h2V6l5 5 1.5-1.5L12 2z"/></svg>
  立即下载 0.0.6
</a>  
- **更新日志** <div class="log-box" id="log-006">加载中…</div>

---

## 🔧 0.0.5 LTS（仅 Win7）
- **最新版本号** <span id="v-005">加载中…</span>  
- <a class="btn-dl" href="https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/005/Latest.exe">
  <svg width="20" height="20" fill="currentColor"><path d="M5 20h14v-2H5v2zm7-18L5.5 9.5 7 11l5-5v14h2V6l5 5 1.5-1.5L12 2z"/></svg>
  立即下载 0.0.5 LTS
</a>  
- **更新日志** <div class="log-box" id="log-005">加载中…</div>

<script setup>
import { onMounted } from 'vue'

const urls = [
  { ver:'v-006', log:'log-006',
    verUrl:'https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/version006.txt',
    logUrl:'https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/updatelog6' },
  { ver:'v-005', log:'log-005',
    verUrl:'https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/005/version005',
    logUrl:'https://gitee.com/linfon18/minecraft-connect-tool-api/raw/master/005/005Updatelog' }
]

onMounted(async () => {
  for (const { ver, log, verUrl, logUrl } of urls) {
    try {
      document.getElementById(ver).textContent = (await (await fetch(verUrl)).text()).trim()
      document.getElementById(log).textContent = (await (await fetch(logUrl)).text()).trim()
    } catch {
      document.getElementById(ver).textContent = '获取失败'
      document.getElementById(log).textContent = '获取失败，请稍后刷新重试。'
    }
  }
})
</script>
