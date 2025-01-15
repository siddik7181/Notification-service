import { AxiosRequestConfig } from "axios";
import Mail from "../../../types/mail";
import { BaseClass } from ".";
import { emailServiceFirst, emailServiceSecond, emailServiceThird } from "./configs";

export class EmailProviderA extends BaseClass {
    data: Mail;
    constructor(data: Mail) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${emailServiceFirst.host}:${emailServiceFirst.port}/api`,
            url: emailServiceFirst.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}
export class EmailProviderB extends BaseClass {
    data: Mail;
    constructor(data: Mail) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${emailServiceSecond.host}:${emailServiceSecond.port}/api`,
            url: emailServiceSecond.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}
export class EmailProviderC extends BaseClass {
    data: Mail;
    constructor(data: Mail) {
        super();
        this.data = data;
    }
    async call() {
        const request: AxiosRequestConfig = {
            baseURL: `http://${emailServiceThird.host}:${emailServiceThird.port}/api`,
            url: emailServiceThird.url,
            method: "post",
            data: this.data
        }
        await this.breaker.fire(request);
    }
}