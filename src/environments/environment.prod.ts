import { appConfig } from "../app/app-config";

export const environment = {
    production: true,
    testing: false,
    functions: {
        networkData: {
            url: 'https://us-central1-' + appConfig.firebase.projectId + '.cloudfunctions.net/networkData'
        },
        trafficData: {
            url: 'https://us-central1-' + appConfig.firebase.projectId + '.cloudfunctions.net/trafficData'
        }
    }
};
