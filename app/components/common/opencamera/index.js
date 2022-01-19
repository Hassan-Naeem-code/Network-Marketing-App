/* eslint-disable prettier/prettier */
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const takeImageUsingCamera = (callback) => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
      width: 50,
      height: 50,
    },
    noData: true,
  };
  launchCamera(options, (response) => {
    let result = null;
    if (response.didCancel) {
      result = { error: true, msg: 'User cancelled image picker', data: response.errorMessage };
    } else if (response.errorCode) {
      result = { error: true, msg: 'ImagePicker Error', data: response.errorMessage };
    } else {
      result = { error: false, msg: 'Image Taken', data: response };
    }
    callback(result);
  });
};

export const openImageGalley = (callback) => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  launchImageLibrary(options, (response) => {
    let result = null;
    if (response.didCancel) {
      result = { error: true, msg: 'User cancelled image picker', data: response.errorMessage };
    } else if (response.errorCode) {
      result = { error: true, msg: 'ImagePicker Error', data: response.errorMessage };
    } else {
      result = { error: false, msg: 'Image Taken', data: response };
    }
    callback(result);
  });
}