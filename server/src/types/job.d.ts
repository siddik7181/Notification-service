import Mail from "./mail";
import Sms from "./sms";

type Job = {
    id: string;
    data: Mail | Sms;
}

export default Job