import nodeMailer, { Transporter } from 'nodemailer';

class SendMailService {
  private transporter: Transporter;
  private to: string;
  private subject: string;
  private text: string;
  private html: string;
  private readonly from = process.env.GMAIL_APP_ADDRESS;

  constructor(
    service: string,
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    this.transporter = nodeMailer.createTransport({
      service,
      auth: {
        user: process.env.GMAIL_APP_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }

  public async call() {
    const info = await this.transporter.sendMail({
      from: this.from, // sender address
      to: this.to, // list of receivers
      subject: this.subject, // Subject line
      text: this.text, // plain text body
      html: this.html,
    });

    console.log('Message sent: %s', info.messageId);
  }
}

export default SendMailService;
