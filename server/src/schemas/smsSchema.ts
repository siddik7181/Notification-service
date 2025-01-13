import { z } from "zod";

const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
export const smsSchema = z.object({
  text: z.string().trim().min(1),
  phone: z.string().trim().regex(regex),
});
