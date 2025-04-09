import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
    stages: [
        { duration: '5s', target: 2 }, // ramp up
        { duration: '10s', target: 5 }, // stable
        { duration: '5s', target: 10 }, // ramp up
        { duration: '10s', target: 15 }, // stable
        { duration: '10s', target: 0 }, // ramp-down to 0 users
    ],
};

export default () => {
    const res = http.get(`https://fakerestapi.azurewebsites.net`);
    check(res, { '200': (r) => r.status === 200 });
    sleep(1);
};