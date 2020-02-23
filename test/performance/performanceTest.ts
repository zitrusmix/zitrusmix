import {PerformanceObserver, performance} from 'perf_hooks';
import {ContentElement, Zitrusmix} from "../../lib";

const performanceData: Array<any> = [];

const obs = new PerformanceObserver((items) => {
    const entry = items.getEntries()[0];
    performanceData.push({
        name: entry.name,
        duration: entry.duration
    });
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

const contentItems: Array<any> = [];

for(let i = 0; i < 10000; i++) {
    const uri = `/resource/${i}`;
    contentItems.push({
        uri: uri,
        index: i,
        count: 0,
        data: {
            title: 'A test content object',
            blocks: ['A', 'B', 'C']
        }
    });
}

function createElementTest() {
    const mix = new Zitrusmix();
    const elements: Array<ContentElement> = [];

    performance.mark('start');
    for(const item of contentItems) {
        const element = new ContentElement(item.uri, item, mix);
        elements.push(element);
    }
    performance.mark('stop');
    performance.measure('Creating new elements', 'start', 'stop');
}

function addTest() {
    const mix = new Zitrusmix();
    performance.mark('start');
    for(const item of contentItems) {
        mix.add(item.uri, item);
    }
    performance.mark('stop');
    performance.measure('Adding new elements', 'start', 'stop');
}

function mixPatchTest() {
    const mix = new Zitrusmix();
    for(const item of contentItems) {
        mix.add(item.uri, item);
    }
    performance.mark('start');
    for(const item of contentItems) {
        mix.patch(item.uri, {count: 1});
    }
    performance.mark('stop');
    performance.measure('Mix patch', 'start', 'stop');
}

function collectionPatchTest() {
    const mix = new Zitrusmix();
    for(const item of contentItems) {
        mix.add(item.uri, item);
    }
    performance.mark('start');
    mix.all().forEach(element => element.patch({count: 1}));
    performance.mark('stop');
    performance.measure('Collection patch', 'start', 'stop');
}

createElementTest();
addTest();
mixPatchTest();
collectionPatchTest();

console.log(JSON.stringify(performanceData, null, 4));
