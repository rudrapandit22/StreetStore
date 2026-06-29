import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

export const imagekitclient = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadfile({ buffer, fileName, folder = "snitch" }) {
    const result = await imagekitclient.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })
    return result
}

export function getAuthParams() {
    return imagekitclient.getAuthenticationParameters();
}