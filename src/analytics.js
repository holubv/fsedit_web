export default class Analytics {

    constructor() {
        this.gt = null;
        this.queue = [];
        this.disabled = false;
    }

    init() {
        setTimeout(() => {
            let gt = window.goatcounter;
            if (!gt) {
                console.warn('ANL: analytics unavailable');
                this.disabled = true;
                return;
            }

            let f = gt.filter();
            if (f) {
                console.warn('ANL: analytics disabled: ' + f);
                this.disabled = true;
                return;
            }

            this.gt = gt;
            this.__processQueue();

        }, 4000);

    }

    logPageView() {
        let path = window.location.pathname;

        let workspace = path.split('/')[1];
        if (workspace && workspace.length === 14) {
            path = '/workspace';
        }

        this.__log({
            path: path
        });
    }

    logEvent(event) {
        this.__log({
            path: event,
            event: true
        });
    }

    __log(data) {
        if (this.disabled) {
            return;
        }

        if (this.gt) {
            this.__count(data);
        } else {
            this.queue.push(data);
        }
    }

    __processQueue() {
        if (!this.gt || this.disabled) {
            return;
        }

        while (this.queue.length) {
            console.log('ANL: processing queue');
            let obj = this.queue.shift();
            this.__count(obj);
        }
    }

    __count(data) {
        if (this.gt) {
            console.log('ANL: count ' + data.path);
            this.gt.count(data);
        }
    }
}