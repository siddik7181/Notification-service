import { AxiosRequestConfig } from "axios";
import Mail from "../../../types/mail";
import { emailProviders } from ".";
import { Provider } from "../../../utils/enums";
import Circuit, { CircuitState } from "../../../utils/breaker";
import { PROVIDERHOST } from "../../secret";
import { BaseProvider } from "./base";

export class EmailProviderA implements BaseProvider {
    url: string;
    breaker: Circuit;
    used: number;
    constructor() {
        this.url = `http://${PROVIDERHOST}:8091/api/email/provider1`;
        this.breaker = new Circuit({maxFailureAllowed: 5, timeout: 2000});
        this.used = 0;
    }
    isProviderOpen(): boolean {
        return this.breaker.getState() === CircuitState.OPEN;
    }
    async call(data: Mail): Promise<void> {
        const request: AxiosRequestConfig = {
            url: this.url,
            method: "post",
            data: data
        }
        await this.breaker?.fire(request);
    }
    allcate() {
        this.used += 1;
    }
    deallocate() {
        this.used = Math.max(this.used - 1, 0);
    }
    getLoad() {
        return this.used;
    }
}
export class EmailProviderB implements BaseProvider {
    url: string;
    breaker: Circuit;
    used: number;
    constructor() {
        this.url = `http://${PROVIDERHOST}:8092/api/email/provider2`;
        this.breaker = new Circuit({maxFailureAllowed: 5, timeout: 2000});
        this.used = 0;
    }
    isProviderOpen(): boolean {
        return this.breaker.getState() === CircuitState.OPEN;
    }
    async call(data: Mail): Promise<void> {
        const request: AxiosRequestConfig = {
            url: this.url,
            method: "post",
            data: data
        }
        await this.breaker?.fire(request);
    }
    allcate() {
        this.used += 1;
    }
    deallocate() {
        this.used = Math.max(this.used - 1, 0);
    }
    getLoad() {
        return this.used;
    }
}
export class EmailProviderC implements BaseProvider {
    url: string;
    breaker: Circuit;
    used: number;
    constructor() {
        this.url = `http://${PROVIDERHOST}:8093/api/email/provider3`;
        this.breaker = new Circuit({maxFailureAllowed: 5, timeout: 2000});
        this.used = 0;
    }
    isProviderOpen(): boolean {
        return this.breaker.getState() === CircuitState.OPEN;
    }
    async call(data: Mail): Promise<void> {
        const request: AxiosRequestConfig = {
            url: this.url,
            method: "post",
            data: data
        }
        await this.breaker?.fire(request);
    }
    allcate() {
        this.used += 1;
    }
    deallocate() {
        this.used = Math.max(this.used - 1, 0);
    }
    getLoad() {
        return this.used;
    }
}

export const handleEmailRequest = async (provider: Provider, data: Mail) => {
    
    const emailProviderClass = chooseProvider(provider);
    if (emailProviderClass.isProviderOpen()) {
            throw ({
              message: "EmailProvider Circuit Is Still Open!",
              isRetryAble: true,
              isCircuitError: true
            });
          }
    await emailProviderClass.call(data);
}


const chooseProvider = (provider: Provider) => {
    if (provider === Provider.First) {
            return emailProviders.emailProviderA || new EmailProviderA();
        }
        if (provider === Provider.Second) {
            return emailProviders.emailProviderB || new EmailProviderB();
        }
        return emailProviders.emailProviderC || new EmailProviderC();
}

