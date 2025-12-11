<template>
    <div class="header">
        <div class="left">
            <img @click="go('/')" class="w-24 h-6 pr-4 border-r" src="../../assets/img/logo.svg"/>
        </div>
        <div class="hidden lg:flex">
        </div>
        <div>
            <el-button type="primary" size="large"  @click="connectWalletClick()">连接钱包</el-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { connectWallet } from '@/plugins/auth';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();

const go = async (url: string) => {
    router.push(url)
}

async function connectWalletClick() {
    await connectWallet(router, route)
}

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