import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

export const imagekitclient = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadfile({ buffer, fileName, folder = "snitch" }) {
    const result = await imagekitclient.files.upload({
        file: buffer.toString("base64"),
        fileName,
        folder
    })
    return result
}

export function getAuthParams() {
    return imagekitclient.helper.getAuthenticationParameters();
}