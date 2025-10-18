import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type TSendEmail = { subject: string; html: string };

export const sendEmail = async ({ subject, html }: TSendEmail) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "suvasispatra10@gmail.com",
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
