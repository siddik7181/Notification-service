import Mail from "../../../types/mail";
import Sms from "../../../types/sms";
import Circuit from "../../../utils/breaker";

export interface BaseProvider {
    url: string;
    breaker?: Circuit;
    used: number;
    call(data: Mail | Sms): Promise<void>;
}