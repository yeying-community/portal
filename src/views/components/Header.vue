<template>
    <div class="header">
        <div class="left">
            <img @click="go('/')" class="w-24 h-6 pr-4 border-r" src="../../assets/img/logo.svg"/>
        </div>
        <div class="hidden lg:flex">
            <!-- <Language/>
            <UserMenu/> -->
        </div>
        <!-- <div class="flex lg:hidden">
            <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="openSlide">
              <span class="sr-only">Open main menu</span>
              <span class="iconfont icon-horizon scale-125"/>
            </button>
          </div> -->
        <div>
            <el-button type="primary" size="large"  @click="connectWalletClick()">连接钱包</el-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
// import Language from '@/components/common/Language.vue'
// import UserMenu from '@/components/common/UserMenu.vue'
// import {useProfileStore} from '@/stores/index'
// const profileStore = useProfileStore()
import { connectWallet } from '@/plugins/auth';
import { notifyError } from '@/utils/message';
import { useRouter, useRoute } from 'vue-router'
import { waitForWallet } from '../../plugins/auth'
import { getWalletDataStore } from '@/stores/auth'

const router = useRouter();
const route = useRoute();

const go = async (url: string) => {
    router.push(url)
}

async function connectWalletClick() {
    await connectWallet(router, route)
}

// 页面加载时检测钱包
window.addEventListener('load', async () => {
  try {
    await waitForWallet();
    getWalletDataStore().setWalletReady(true)
  } catch (error) {
    console.error('钱包检测失败:', error);
    const innerHTML = `
        <p>❌ 未检测到钱包</p>
        <p class="error">请确保：</p>
        <ul>
        <li>•已安装 YeYing Wallet 扩展</li>
        <li>•已启用扩展</li>
        <li>•已在扩展设置中允许访问文件 URL（如果使用 file:// 协议）</li>
        <li>•刷新页面后重试</li>
        </ul>
    `;
    notifyError(innerHTML)
  }
});

</script>
<style scoped lang="less">
.header{
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    .left{
        display: flex;
        align-items: center;
        gap: 10px;
    }
}
</style>