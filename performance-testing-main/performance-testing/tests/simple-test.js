import http from 'k6/http';

const config = JSON.parse(open('./config.json'));

export const options = {
    vus: Number(config.vus),
    duration: '2s'
};

export default () => {
    http.get(config.url);
};