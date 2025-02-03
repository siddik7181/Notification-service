import { AxiosRequestConfig } from "axios";
import Sms from "../../../types/sms";
// import { smsProviders } from ".";
import { Provider } from "../../../utils/enums";
import Circuit, { CircuitState } from "../../../utils/breaker";
import { PROVIDERHOST } from "../../secret";
import { BaseProvider, Singleton } from "./base";

@Singleton
export class SmsProviderA implements BaseProvider {
  url: string;
  breaker: Circuit;
  used: number;
  myProvider: Provider;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8071/api/sms/provider1`;
    this.breaker = new Circuit({ maxFailureAllowed: 5, timeout: 2000 });
    this.used = 0;
    this.myProvider = Provider.First;
  }
  isProviderOpen(): boolean {
    return this.breaker.getState() === CircuitState.OPEN;
  }
  async call(data: Sms): Promise<void> {
    const request: AxiosRequestConfig = {
      url: this.url,
      method: "post",
      data: data,
    };
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
@Singleton
export class SmsProviderB implements BaseProvider {
  url: string;
  breaker: Circuit;
  used: number;
  myProvider: Provider;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8072/api/sms/provider2`;
    this.breaker = new Circuit({ maxFailureAllowed: 5, timeout: 2000 });
    this.used = 0;
    this.myProvider = Provider.Second;
  }
  isProviderOpen(): boolean {
    return this.breaker.getState() === CircuitState.OPEN;
  }
  async call(data: Sms): Promise<void> {
    const request: AxiosRequestConfig = {
      url: this.url,
      method: "post",
      data: data,
    };
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
@Singleton
export class SmsProviderC implements BaseProvider {
  url: string;
  breaker: Circuit;
  used: number;
  myProvider: Provider;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8073/api/sms/provider3`;
    this.breaker = new Circuit({ maxFailureAllowed: 5, timeout: 2000 });
    this.used = 0;
    this.myProvider = Provider.Third;
  }
  async call(data: Sms): Promise<void> {
    const request: AxiosRequestConfig = {
      url: this.url,
      method: "post",
      data: data,
    };
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

// Test whether it handles the request & throw error if any.
export const handleSmsRequest = async (provider: Provider, data: Sms) => {
  const smsProviderClass = chooseProvider(provider);
  await smsProviderClass.call(data);
};

// Test whether it choose the currect provider class
const chooseProvider = (provider: Provider) => {
  if (provider === Provider.First) {
    return new SmsProviderA();
  }
  if (provider === Provider.Second) {
    return new SmsProviderB();
  }
  return new SmsProviderC();
};
