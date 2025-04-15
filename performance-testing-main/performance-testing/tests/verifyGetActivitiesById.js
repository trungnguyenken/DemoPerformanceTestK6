import http from 'k6/http';
import { check, sleep } from 'k6';

const config = JSON.parse(open('./config.json'));

export const options = {
    vus: Number(config.vus),
    duration: '2s'
};

export default () => {
    http.get(config.url);
    
    const resAll = http.get(config.url + '/api/v1/Activities');

    check(resAll, {
        'GET /Activities status is 200': (r) => r.status === 200,
    });

    const activities = resAll.json();

    // Pick the first activity (or any one)
    const firstActivity = activities[0];
    const activityId = firstActivity.id;

    
    const resById = http.get(`${config.url}/api/v1/Activities/${activityId}`);

    //Validate response
    check(resById, {
        'GET /Activities/{id} status is 200': (r) => r.status === 200,
        'Content-Type is application/json': (r) => r.headers['Content-Type'].includes('application/json'),
    });

    const activity = resById.json();

     //Validate structure and values
     check(activity, {
        'has correct id': (a) => a.id === activityId,
        'has title': (a) => typeof a.title === 'string' && a.title.length > 0,
        'has dueDate': (a) => typeof a.dueDate === 'string' && a.dueDate.length > 0,
        'has completed': (a) => typeof a.completed === 'boolean',
    });

    console.log(`✅ Activity #${activityId} validated.`);

};