# 获取帮助

<script setup>
// 点击涟漪特效
const ripple = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const span = document.createElement('span')
  const size = Math.max(target.clientWidth, target.clientHeight)
  const rect = target.getBoundingClientRect()
  span.style.cssText = `
    position:absolute;border-radius:50%;
    transform:scale(0);background:#fff4;
    animation:ripple .6s linear;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    width:${size}px;height:${size}px;pointer-events:none;
  `
  target.appendChild(span)
  setTimeout(() => span.remove(), 600)
}
</script>

<style scoped>
@keyframes ripple{to{transform:scale(2);opacity:0}}
@keyframes pulse{
  0%{box-shadow:0 0 0 0 #00a4ff80}
  70%{box-shadow:0 0 0 10px #00a4ff00}
  100%{box-shadow:0 0 0 0 #00a4ff00}
}
.join-btn{
  position:relative;
  display:inline-block;
  padding:16px 36px;
  background:linear-gradient(135deg,#00a4ff 0%,#0078ff 100%);
  color:#fff;
  font-size:18px;
  font-weight:600;
  border-radius:50px;
  cursor:pointer;
  transition:transform .3s;
  animation:pulse 2s infinite;
  overflow:hidden;
}
.join-btn:hover{transform:scale(1.05)}
</style>

💡 遇到问题？  
扫码或点击下方按钮即可 **一键加入** 官方交流群。

<div style="text-align:center;margin:32px 0">
  <a class="join-btn"
     href="https://qm.qq.com/q/CGEau5xchG"
     target="_blank"
     @click="ripple">
    🚀 立即加入群聊
  </a>
</div>

---

- **群名：** ✨Minecraft Connect Tool交流群 / M_Bot战双自动签  
- **群号：** **690625244**  
- **二群：** 940606962（满人备用，答案填“联机”）

> 进群请遵守：禁广告 / 禁商业推广，违者飞机票🛫
