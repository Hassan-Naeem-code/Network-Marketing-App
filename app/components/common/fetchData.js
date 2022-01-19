/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'https://network-app-server.herokuapp.com';
const BASE_URL = 'http://192.168.0.104:5001';

export async function postData(url, data, method = 'POST', formData = false) {
  const token = await AsyncStorage.getItem('token');
  const header = {
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
  };
  if (formData) {
    delete header['content-type'];
    header['Content-Type'] = 'multipart/form-data';
  }

  url = `${BASE_URL}${url}`;
  const response = await fetch(url, {
    method: method,
    body: formData ? data : JSON.stringify(data),
    headers: header,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const context = { error: true, msg: errorText, data: null };
    return context;
  }
  const res = await response.json();
  const context = { error: false, msg: res.msg, data: res };
  return context;
}

export async function getData(url, method = 'GET') {
  url = `${BASE_URL}${url}`;
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    const context = { error: true, msg: errorText, data: null, statusCode: response.status };
    return context;
  }
  const res = await response.json();
  const context = { error: false, msg: res.msg, data: { ...res } };
  return context;
}