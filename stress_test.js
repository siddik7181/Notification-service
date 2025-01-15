
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 }, // traffic ramp-up from 1 to a higher 100 users over 30 sec.
    { duration: "2m", target: 100 }, // stay at higher 100 users for 2 minute
    { duration: "10s", target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
  const { EMAIL_URL, mailPayload, SMS_URL, smsPayload, params } = test_data;

  const mailRes = http.post(EMAIL_URL, mailPayload, params);
  const smsRes = http.post(SMS_URL, smsPayload, params);

  check(mailRes, {
    "is status 200": (r) => r.status === 200,
    "mailRes time is acceptable": (r) => r.timings.duration < 3000,
  });
  check(smsRes, {
    "is status 200": (r) => r.status === 200,
    "smsRes time is acceptable": (r) => r.timings.duration < 3000,
  });
}

const test_data = {
  EMAIL_URL: "http://notify-server:8080/api/email",
  SMS_URL: "http://notify-server:8080/api/sms",

  mailPayload: JSON.stringify({
    subject: "A subject has nothing🙄!",
    body: "Anything you like",
    recipients: ["absiddik@gmail.com", "nahid@gmail.com"],
  }),
  smsPayload: JSON.stringify({
    text: "hello",
    phone: "+8801921650976",
  }),
  params: {
    headers: {
      "Content-Type": "application/json",
    },
  },
};
