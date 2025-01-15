import { AxiosRequestConfig } from "axios";
import Sms from "../../../types/sms";
import { BaseClass } from ".";
import { smsServiceFirst, smsServiceSecond, smsServiceThird } from "./configs";

export class SmsProviderA extends BaseClass {
    data: Sms;
    constructor(data: Sms) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${smsServiceFirst.host}:${smsServiceFirst.port}/api`,
            url: smsServiceFirst.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}
export class SmsProviderB extends BaseClass {
    data: Sms;
    constructor(data: Sms) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${smsServiceSecond.host}:${smsServiceSecond.port}/api`,
            url: smsServiceSecond.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}
export class SmsProviderC extends BaseClass {
    data: Sms;
    constructor(data: Sms) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${smsServiceThird.host}:${smsServiceThird.port}/api`,
            url: smsServiceThird.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}
