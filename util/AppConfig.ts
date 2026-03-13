const DEV = false;

const AppConfig = {
    API_URL: DEV ? "http://127.0.0.1:3001/api" : "https://dailybug-api.vercel.app/api",
    api: (path: string) => `${AppConfig.API_URL}/${path}`
};

export default AppConfig;
