
import { Provider } from "../../../utils/enums";
import { EmailProviderA, EmailProviderB, EmailProviderC } from "./email";
import { SmsProviderA, SmsProviderB, SmsProviderC } from "./sms";


export const smsProviders = {
    smsProviderA: new SmsProviderA(),
    smsProviderB: new SmsProviderB(),
    smsProviderC: new SmsProviderC()
}
export const emailProviders = {
    emailProviderA: new EmailProviderA(),
    emailProviderB: new EmailProviderB(),
    emailProviderC: new EmailProviderC(),
}

export const initNotificationsProviders = () => {
    console.log("Initializing Providers:...");
    emailProviders.emailProviderA = new EmailProviderA();
    emailProviders.emailProviderB = new EmailProviderB();
    emailProviders.emailProviderC = new EmailProviderC();

    smsProviders.smsProviderA = new SmsProviderA();
    smsProviders.smsProviderB = new SmsProviderB();
    smsProviders.smsProviderC = new SmsProviderC();
}

export const currentLessBusyEmailProvider = (): Provider => {
    let providerA: number = emailProviders.emailProviderA.getLoad() || 0;
    if (emailProviders.emailProviderA.isProviderOpen())providerA = Number.MAX_VALUE;

    let providerB: number = emailProviders.emailProviderB.getLoad() || 0;
    if (emailProviders.emailProviderB.isProviderOpen())providerB = Number.MAX_VALUE;

    let providerC: number = emailProviders.emailProviderC.getLoad() || 0;
    if (emailProviders.emailProviderC.isProviderOpen())providerC = Number.MAX_VALUE;

    return chooseMinimum("email", providerA, providerB, providerC);
}

export const currentLessBusySmsProvider = (): Provider => {
    let providerA: number = smsProviders.smsProviderA.getLoad() || 0;
    if (smsProviders.smsProviderA.isProviderOpen())providerA = Number.MAX_VALUE;
    
    let providerB: number = smsProviders.smsProviderB.getLoad() || 0;
    if (smsProviders.smsProviderB.isProviderOpen())providerB = Number.MAX_VALUE;
    
    let providerC: number = smsProviders.smsProviderC.getLoad() || 0;
    if (smsProviders.smsProviderC.isProviderOpen())providerC = Number.MAX_VALUE;

    return chooseMinimum("sms", providerA, providerB, providerC);
}

const chooseMinimum = (type: "email" | "sms", a:number, b: number, c: number): Provider => {
    const minUsed = Math.min(a, b, c);
    console.log(`Count Of --> PROVIDER_A: ${a}, PROVIDER_B: ${b}, PROVIDER_C: ${c}`)
    const result = minUsed === a ? Provider.First : minUsed === b ? Provider.Second : Provider.Third;
    if (type === "email")allocateEmail(result);
    else allocateSms(result);
    return result;
}

const allocateEmail = (provider: Provider):void => {
    if (provider === Provider.First)emailProviders.emailProviderA.allcate();
    else if (provider === Provider.Second)emailProviders.emailProviderB.allcate();
    else if (provider === Provider.Third)emailProviders.emailProviderC.allcate();
}
const allocateSms = (provider: Provider):void => {
    if (provider === Provider.First)smsProviders.smsProviderA.allcate();
    else if (provider === Provider.Second)smsProviders.smsProviderB.allcate();
    else if (provider === Provider.Third)smsProviders.smsProviderC.allcate();
}

export const currentLessProvider = (type: "email" | "sms"): Provider => {
  if (type === "email")return currentLessBusyEmailProvider();
  return currentLessBusySmsProvider();
}

const deallocateEmail = (provider: Provider):void => {
    if (provider === Provider.First)emailProviders.emailProviderA.deallocate();
    else if (provider === Provider.Second)emailProviders.emailProviderB.deallocate();
    else if (provider === Provider.Third)emailProviders.emailProviderC.deallocate();
}
const deallocateSms = (provider: Provider):void => {
    if (provider === Provider.First)smsProviders.smsProviderA.deallocate();
    else if (provider === Provider.Second)smsProviders.smsProviderB.deallocate();
    else if (provider === Provider.Third)smsProviders.smsProviderC.deallocate();
}

export const deallocateProvider = (type: "email" | "sms", provider: Provider)=> {
    return type === "email" ? deallocateEmail(provider) : deallocateSms(provider);
}