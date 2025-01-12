import { z } from 'zod'

export const emailSchema = z.object({
    subject: z.string().trim().min(5),
    body: z.string().trim().min(10),
    recipients: z.string().email().array().nonempty()
});
