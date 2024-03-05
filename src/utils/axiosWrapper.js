import axios from 'axios';
import qs from 'qs';
import { API_URL as BASE_URL } from './constants';

const API_GENERAL_ERROR_MESSAGE = 'Request error, please try again later!';

const request = () => {
    const instance = axios.create();

    instance.interceptors.request.use(
        config => {
            const { url, params, data, method, headers } = config;
            return config;
        },
        error => Promise.reject(error)
    );

    instance.interceptors.response.use(
        response => {
            const { success, resultCode, resultMessage = API_GENERAL_ERROR_MESSAGE } = response.data;
            // if (!success && resultCode !== SUCCESS_RESULT_CODE) {
            //   Message.error(resultMessage);
            //   return Promise.reject(new Error(resultMessage));
            // }
            return response;
        },
        error => {
            if (error.response) {
                const { data = {}, status } = error.response;
                let message = `HTTP ERROR: ${status}`;
                if (typeof data === 'string') {
                    message = data;
                } else if (typeof data === 'object') {
                    message = data.message;
                }

                return Promise.reject(error.response);
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

const requestAxios = request()

class Api {
    baseUrl = BASE_URL;

    async makeRequest(path, method = 'POST', config) {
        const url = `${this.baseUrl}/${path}`;

        const axiosConfig = config || {};
        if (method !== 'GET' && axiosConfig.data) {
            axiosConfig.headers = axiosConfig.headers || {};
            axiosConfig.headers['Content-Type'] = axiosConfig.headers['Content-Type'] || 'application/json';
        }

        try {
            const response = await requestAxios({
                url,
                method,
                ...axiosConfig,
            });
            return response.data;
        } catch (error) {
            const errorPath = url;
            if (error.response) {
                const { pathname } = document.location;
                throw new Error(`${errorPath} | ${error.response.data} | ${error.response.status} | ${pathname}`);
            }
            throw new Error(`${errorPath} | ${error.message || error}`);
        }
    }

    GET_FILES_X = { path: 'api/files-list', method: 'GET' };
    getFilesXLSX() {
        const { path, method } = this.GET_FILES_X;
        return this.makeRequest(path, method);
    }

    GET_FILES_STATS = { path: 'api/files-stats', method: 'POST' };
    getFilesStats(fileName) {
        const { path, method } = this.GET_FILES_STATS;
        const parameters = {
            data: {fileName},
        };
        return this.makeRequest(path, method, parameters);
    }

    // REWRITES_LIST = { path: 'rewrite/list', method: 'GET' };

    // REWRITE_ADD = { path: 'rewrite/add', method: 'POST' };

    // REWRITE_UPDATE = { path: 'rewrite/update', method: 'PUT' };

    // REWRITE_DELETE = { path: 'rewrite/delete', method: 'POST' };

    // getRewritesList() {
    //     const { path, method } = this.REWRITES_LIST;
    //     return this.makeRequest(path, method);
    // }

    // addRewrite(config) {
    //     const { path, method } = this.REWRITE_ADD;
    //     const parameters = {
    //         data: config,
    //     };
    //     return this.makeRequest(path, method, parameters);
    // }

    // updateRewrite(config) {
    //     const { path, method } = this.REWRITE_UPDATE;
    //     const parameters = {
    //         data: config,
    //     };
    //     return this.makeRequest(path, method, parameters);
    // }

    // deleteRewrite(config) {
    //     const { path, method } = this.REWRITE_DELETE;
    //     const parameters = {
    //         data: config,
    //     };
    //     return this.makeRequest(path, method, parameters);
    // }


    // Settings for statistics
    // GET_STATS = { path: 'stats', method: 'GET' };
    // getStats() {
    //     const { path, method } = this.GET_STATS;
    //     return this.makeRequest(path, method);
    // }

    // Profile
    // GET_PROFILE = { path: 'profile', method: 'GET' };
    // UPDATE_PROFILE = { path: 'profile/update', method: 'PUT' };
    // getProfile() {
    //     const { path, method } = this.GET_PROFILE;
    //     return this.makeRequest(path, method);
    // }
    // setProfile(data) {
    //     const theme = data.theme ? data.theme : THEMES.auto;
    //     const defaultLanguage = i18n.language ? i18n.language : LANGUAGES.en;
    //     const language = data.language ? data.language : defaultLanguage;

    //     const { path, method } = this.UPDATE_PROFILE;
    //     const config = { data: { theme, language } };

    //     return this.makeRequest(path, method, config);
    // }
    // Cache
    // CLEAR_CACHE = { path: 'cache_clear', method: 'POST' };
    // clearCache() {
    //     const { path, method } = this.CLEAR_CACHE;
    //     return this.makeRequest(path, method);
    // }
}

const axiosWrapper = new Api();
export default axiosWrapper