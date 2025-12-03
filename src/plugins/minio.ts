import { getWalletDataStore } from "@/stores/auth";
import { notifyError } from "@/utils/message";

class $minio {

    async getUploadUrl(filename: string) {
        if (localStorage.getItem("hasConnectedWallet") === "false") {
            notifyError('❌未检测到钱包，请先安装并连接钱包');
            return;
        }
        const token = localStorage.getItem("authToken")
        const header = {
            "did": "xxxx"
        }
        const body = {
            "header": header,
            "body": {
                "filename": filename
            }
        }
        const response = await fetch('/api/v1/minio/presigned/upload/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,
                'accept': 'application/json'
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.status} error: ${await response.text()}`);
        }

        const r =  await response.json();
        return r.body.url
    }

}

export default new $minio()