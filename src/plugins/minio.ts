const token = localStorage.getItem("authToken")

class $minio {

    async getUploadUrl(filename: string) {
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