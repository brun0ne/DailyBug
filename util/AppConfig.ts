const DEV = false;

const AppConfig = {
    API_URL: DEV ? "http://192.168.254.101:3000/api" : "https://dailybug.app/api",
    api: (path: string) => `${AppConfig.API_URL}/${path}`
};

export default AppConfig;
