import { AxiosRequestConfig } from "axios";
import Mail from "../../../types/mail";
// import { emailProviders } from ".";
import { Provider } from "../../../utils/enums";
import Circuit, { CircuitState } from "../../../utils/breaker";
import { PROVIDERHOST } from "../../secret";
import { BaseProvider, circuitOps, Singleton } from "./base";

@Singleton
export class EmailProviderA implements BaseProvider {
  url: string;
  breaker: Circuit;
  myProvider: Provider;
  used: number;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8091/api/email/provider1`;
    this.breaker = new Circuit(circuitOps);
    this.used = 0;
    this.myProvider = Provider.First;
  }

  isProviderOpen(): boolean {
    return this.breaker.getState() === CircuitState.OPEN;
  }
  async call(data: Mail): Promise<void> {
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
export class EmailProviderB implements BaseProvider {
  url: string;
  breaker: Circuit;
  used: number;
  myProvider: Provider;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8092/api/email/provider2`;
    this.breaker = new Circuit(circuitOps);
    this.used = 0;
    this.myProvider = Provider.Second;
  }
  isProviderOpen(): boolean {
    return this.breaker.getState() === CircuitState.OPEN;
  }
  async call(data: Mail): Promise<void> {
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
export class EmailProviderC implements BaseProvider {
  url: string;
  breaker: Circuit;
  used: number;
  myProvider: Provider;
  constructor() {
    this.url = `http://${PROVIDERHOST}:8093/api/email/provider3`;
    this.breaker = new Circuit(circuitOps);
    this.used = 0;
    this.myProvider = Provider.Third;
  }
  async call(data: Mail): Promise<void> {
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
export const handleEmailRequest = async (provider: Provider, data: Mail) => {
  const emailProviderClass = chooseProvider(provider);
  await emailProviderClass.call(data);
};

// Test whether it choose the currect provider class
const chooseProvider = (provider: Provider) => {
  if (provider === Provider.First) {
    return new EmailProviderA();
  }
  if (provider === Provider.Second) {
    return new EmailProviderB();
  }
  return new EmailProviderC();
};
