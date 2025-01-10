
// Stress testing assesses how the system performs when loads are heavier than usual.

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Key configurations for Stress in this section
  stages: [
    { duration: '10s', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '1m', target: 200 }, // stay at higher 200 users for 30 minutes
    { duration: '10s', target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
    const { EMAIL_URL, mailPayload, SMS_URL, smsPayload, params } = test_data;

    const mailRes = http.post(EMAIL_URL, mailPayload, params);
    const smsRes = http.post(SMS_URL, smsPayload, params);

    check(mailRes, {
      'is status 200': (r) => r.status === 200,
      'mailRes time is acceptable': (r) => r.timings.duration < 2000, // example threshold
    });
    check(smsRes, {
      'is status 200': (r) => r.status === 200,
      'smsRes time is acceptable': (r) => r.timings.duration < 2000, // example threshold
    });

}


const test_data = {
  EMAIL_URL: "http://notify-server:8080/send/mail",
  SMS_URL: "http://notify-server:8080/send/sms",

  mailPayload: JSON.stringify({
      subject: "A subject has nothing🙄!",
      body: "Anything you like",
      recipients: [
          "absiddik@gmail.com",
          "nahid@gmail.com"
      ]
  }),
  smsPayload: JSON.stringify({
      text: "hello",
      phone: "+8801921650976"
  }),
  params: {
      headers: {
          'Content-Type': 'application/json',
      },
  }
}