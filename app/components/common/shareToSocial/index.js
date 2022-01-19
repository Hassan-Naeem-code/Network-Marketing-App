/* eslint-disable prettier/prettier */
import { Share } from 'react-native';

const shareToSocialMedia = async (message) => {
  try {
    const APP_URL = 'https://play.google.com/store/apps/details?id=com.network_app';
    const result = await Share.share({
      title: 'Earn Upto Million!',
      message: `Register in our app GangerWin \n${APP_URL}\nusing this Reference code ${message} to earn more`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.log('error in share social==', error);
  }
};

export { shareToSocialMedia };
