import Mail from "../../../types/mail";
import Sms from "../../../types/sms";
import Circuit from "../../../utils/breaker";
import { Provider } from "../../../utils/enums";

export interface BaseProvider {
  url: string;
  breaker?: Circuit;
  used: number;
  myProvider: Provider;
  call(data: Mail | Sms): Promise<void>;
}

export function Singleton<T extends { new (...args: any[]): {} }>(
  target: T
) {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      const ctor = this.constructor as typeof target & {
        instance?: InstanceType<T>;
      };
      if (ctor.instance) {
        return ctor.instance;
      }
      ctor.instance = this as InstanceType<T>;
    }
  };
}
