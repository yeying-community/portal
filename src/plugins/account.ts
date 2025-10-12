import { IndexedCache } from '@yeying-community/yeying-next'

import {
    NamespaceProvider,
    Uploader,
    LinkProvider,
    ApplicationProvider,
    AuditProvider,
    ServiceProvider
} from '@yeying-community/yeying-client-ts'

import { $account } from '@yeying-community/yeying-wallet'
import $service from "@/plugins/service";
import { createIdentity, Identity, IdentityApplicationExtend, IdentityCodeEnum, IdentityTemplate, NetworkTypeEnum, SecurityAlgorithm, serializeIdentityToJson, verifyIdentity } from '@yeying-community/yeying-web3';


let namespaceProvider = null
let uploader = null
let linkProvider = null
let applicationProvider = null
let userInfo: Identity | null | undefined = null
let auditProvider = null
let serviceCenterProvider = null
let indexedCache: IndexedCache = new IndexedCache('yeying-protal', 1)

// 初始化提供者
async function initializeProviders() {
    userInfo = await $account.getActiveIdentity()
    const did = userInfo?.metadata?.did
    let blockAddress = null
    if (did) {
        blockAddress = await $account.getBlockAddress(did)
    }
    if (!blockAddress) return
    let warehouse = null
    let serviceProvider = null
    if (blockAddress) {
        serviceProvider = await $service.search({"code": "SERVICE_CODE_NODE"})
        warehouse = await $service.search({"code": "SERVICE_CODE_WAREHOUSE"})
    }
    const securityAlgorithm = userInfo?.securityConfig?.algorithm as SecurityAlgorithm
    const serviceProviderOption = {
        proxy: serviceProvider && serviceProvider[1] && serviceProvider[1].proxy,
        blockAddress
    }
    const warehouseProviderOption = {
        proxy: warehouse && warehouse[0] && warehouse[0].proxy,
        blockAddress
    }
    namespaceProvider = new NamespaceProvider(warehouseProviderOption)
    uploader = new Uploader(warehouseProviderOption, securityAlgorithm)
    linkProvider = new LinkProvider(warehouseProviderOption)
    applicationProvider = new ApplicationProvider(serviceProviderOption)
    
    await indexedCache.open([
        {
            // 表名
            name: 'applications', 
            // 主键字段
            key: 'uid', 
            // 主键是否自增，走采用 uuid 作为主键
            autoIncrement: false, 
            // 索引：keyPath 表示列名； name 表示索引名； unique 表示字段值是否唯一
            indexes: [{ keyPath: 'owner', name: 'owner', unique: false }]
        },
        {
            name: 'services',
            key: 'uid',
            autoIncrement: false,
            indexes: [{ keyPath: 'owner', name: 'owner', unique: false }]
        },
        {
            // 表名
            name: 'applications_apply', 
            // 主键字段
            key: 'uid', 
            // 主键是否自增，走采用 uuid 作为主键
            autoIncrement: false, 
            // 索引：keyPath 表示列名； name 表示索引名； unique 表示字段值是否唯一
            indexes: [{ keyPath: 'applyOwner', name: 'applyOwner', unique: false }]
        },
        {
            name: 'services_apply',
            key: 'uid',
            autoIncrement: false,
            indexes: [{ keyPath: 'applyOwner', name: 'applyOwner', unique: false }]
        }
    ])

    auditProvider = new AuditProvider(serviceProviderOption)
    serviceCenterProvider = new ServiceProvider(serviceProviderOption)
}

/**
 * 生成身份
 * @param code 
 * @param serviceCodes 
 * @param location 
 * @param hash 
 * @param name 
 * @param description 
 * @param avatar 
 * @param password 
 * @returns 
 */
export async function generateIdentity(code: string, serviceCodes: string, location: string, hash: string, name: string, description: string, avatar: string, password: string) {
    const extend = IdentityApplicationExtend.create({
        code: code,
        serviceCodes: serviceCodes,
        location: location,
        hash: hash
    })

    const template: IdentityTemplate = {
        language: "LANGUAGE_CODE_ZH_CH",
        parent: "",
        network: NetworkTypeEnum.NETWORK_TYPE_YEYING,
        code: IdentityCodeEnum.IDENTITY_CODE_APPLICATION,
        name: name,
        description: description,
        avatar: avatar,
        extend: extend,
    }

    const identity = await createIdentity(template, password)
    const success = await verifyIdentity(identity)
    if (!success) {
        throw new Error("create identity error")
    }
    return identity
}

export {
    applicationProvider,
    initializeProviders,
    namespaceProvider,
    uploader,
    linkProvider,
    auditProvider,
    userInfo,
    serviceCenterProvider,
    indexedCache
}
