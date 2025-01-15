import { PROVIDERHOST } from "../../secret";

const BaseService = (url: string) => {
  return {
    url: url,
  }
}

export const emailServiceFirst = BaseService(`http://${PROVIDERHOST}:8091/api/email/provider1`);
export const emailServiceSecond = BaseService(`http://${PROVIDERHOST}:8092/api/email/provider2`);
export const emailServiceThird = BaseService(`http://${PROVIDERHOST}:8093/api/email/provider3`);

export const smsServiceFirst = BaseService(`http://${PROVIDERHOST}:8071/api/sms/provider1`);
export const smsServiceSecond = BaseService(`http://${PROVIDERHOST}:8072/api/sms/provider2`);
export const smsServiceThird = BaseService(`http://${PROVIDERHOST}:8073/api/sms/provider3`);




