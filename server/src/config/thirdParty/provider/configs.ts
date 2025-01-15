import { PROVIDERHOST } from "../../secret";

const BaseService = (port: number, url: string) => {
  return {
    host: PROVIDERHOST,
    port: port,
    url: url,
  }
}

export const emailServiceFirst = BaseService(8091, "email/provider1");
export const emailServiceSecond = BaseService(8092, "email/provider2");
export const emailServiceThird = BaseService(8093, "email/provider3");

export const smsServiceFirst = BaseService(8071, "sms/provider1");
export const smsServiceSecond = BaseService(8072, "sms/provider2");
export const smsServiceThird = BaseService(8073, "sms/provider3");
