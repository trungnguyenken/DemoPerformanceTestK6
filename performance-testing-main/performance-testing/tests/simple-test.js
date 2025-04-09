import http from 'k6/http';

export const options = {
    vus: 1,
    duration: '2s'
};

export default () => {
    http.get('https://fakerestapi.azurewebsites.net');
};