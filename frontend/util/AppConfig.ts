const DEV = false;

const AppConfig = {
    API_URL: DEV ? "http://127.0.0.1:3001/api" : process.env.EXPO_PUBLIC_API_URL,
    api: (path: string) => `${AppConfig.API_URL}/${path}`,
    GOOGLE_PLAY_AUTH_ENABLED: false,
    GOOGLE_WEB_CLIENT_ID: '',
    GOOGLE_ANDROID_CLIENT_ID: '',
};

export default AppConfig;
