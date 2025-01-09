import Mail from "./mail";
import RetryOptions from "./retry";
import Sms from "./sms";

type Job = {
    id: string;
    data: Mail | Sms;
    options: RetryOptions
}

export default Job