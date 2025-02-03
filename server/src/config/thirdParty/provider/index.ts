
import { CircuitState } from "../../../utils/breaker";
import { Provider } from "../../../utils/enums";
import { EmailProviderA, EmailProviderB, EmailProviderC } from "./email";
import { SmsProviderA, SmsProviderB, SmsProviderC } from "./sms";

const email = {
    providerA: new EmailProviderA(),
    providerB: new EmailProviderB(),
    providerC: new EmailProviderC()
}
const sms = {
    providerA: new SmsProviderA(),
    providerB: new SmsProviderB(),
    providerC: new SmsProviderC()
}


export const currentLessBusyEmailProvider = (): Provider => {
    const providers = [email.providerA, email.providerB, email.providerC];
    const sortedProviders = providers.sort((a, b) => a.getLoad() - b.getLoad());
    for (let provider of sortedProviders) {
        if (provider.breaker.getState() === CircuitState.CLOSE) {
            provider.allcate();
            return provider.myProvider;
        }
    }
    return sortedProviders[0].myProvider;
}
export const currentLessBusySmsProvider = (): Provider => {
    const providers = [sms.providerA, email.providerB, sms.providerC];
    const sortedProviders = providers.sort((a, b) => a.getLoad() - b.getLoad());
    for (let provider of sortedProviders) {
        if (provider.breaker.getState() === CircuitState.CLOSE) {
            provider.allcate();
            return provider.myProvider;
        }
    }
    return sortedProviders[0].myProvider;
}

// Test Wheteher it returns the provider of either type with least requests
export const currentLessProvider = (type: "email" | "sms"): Provider => {
  if (type === "email")return currentLessBusyEmailProvider();
  return currentLessBusySmsProvider();
}

const deallocateEmail = (provider: Provider):void => {
    if (provider === Provider.First)email.providerA.deallocate();
    else if (provider === Provider.Second)email.providerB.deallocate();
    else if (provider === Provider.Third)email.providerC.deallocate();
}
const deallocateSms = (provider: Provider):void => {
    if (provider === Provider.First)sms.providerA.deallocate();
    else if (provider === Provider.Second)sms.providerB.deallocate();
    else if (provider === Provider.Third)sms.providerC.deallocate();
}
// Test Whether specefic types of queue gets deallocated with request & provider
export const deallocateProvider = (type: "email" | "sms", provider: Provider)=> {
    return type === "email" ? deallocateEmail(provider) : deallocateSms(provider);
}