/* eslint-disable prettier/prettier */
import ImgToBase64 from 'react-native-image-base64';
import { Buffer } from 'buffer';


export function trimContent(content, trimAfter = 50) {
  if (content.length >= trimAfter) {
    content = `${content.substring(0, trimAfter)} ....`;
  }
  return content;
}

export async function convertImageToBase64(uri) {
  return ImgToBase64.getBase64String(uri)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('base64 error ===> ', error);
      return null;
    });
}

export async function converImageToBuffer(uri) {
  const img64 = await convertImageToBase64(uri);
  const bufferImg = Buffer.from(img64, 'base64');
  return bufferImg;
}
