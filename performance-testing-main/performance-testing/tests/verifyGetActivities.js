import http from 'k6/http';
import { check, sleep } from 'k6';

const config = JSON.parse(open('./config.json'));

export const options = {
    vus: Number(config.vus),
    duration: '2s'
};

export default () => {
    http.get(config.url);
    
    const res = http.get(config.url + '/api/v1/Activities');

    // Basic checks
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    });

    // Parse the JSON response
    const data = res.json();

    // Check response is an array
    check(data, {
        'response is an array': (d) => Array.isArray(d),
        'contains at least one activity': (d) => d.length > 0,
    });

    // Validate structure of first item (you can loop for more thorough validation)
    if (data.length > 0) {
        const item = data[0];
        check(item, {
            'item has id': (i) => typeof i.id === 'number',
            'item has title': (i) => typeof i.title === 'string' && i.title.length > 0,
            'item has dueDate': (i) => typeof i.dueDate === 'string' && i.dueDate.length > 0,
            'item has completed': (i) => typeof i.completed === 'boolean',
        });
    }

};