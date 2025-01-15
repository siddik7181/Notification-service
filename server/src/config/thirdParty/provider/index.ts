
import Circuit from "../../../utils/breaker";

export class BaseClass {
    breaker = new Circuit({maxFailureAllowed: 6, timeout: 3000});
    private isClose: boolean;
    constructor() {
        this.isClose = true;
    }
    isProviderRunning() {
        return this.breaker.getState();
    }
    call() {
    }
}