import { CronJob } from 'cron';
import Museum from '../models/Museum';
import User from '../models/User';
import SendMailService from './SendMailService';

class MailCronService {
  constructor(private cronTime: string) {}

  private async getMailList() {
    const users = await User.find({ role: 'normal' });
    const userMails = users
      .map((user) => {
        return user.email;
      })
      .join(', ');

    return userMails;
  }

  private async getRandomMuseum() {
    const museums = await Museum.find();
    const randMuseum = museums[Math.floor(Math.random() * museums.length)];

    return randMuseum;
  }

  public async call() {
    const to = await this.getMailList();
    const museum = await this.getRandomMuseum();

    const job = new CronJob(
      this.cronTime,
      async function () {
        const sendMailService = new SendMailService(
          'gmail',
          to,
          'Weekly Visit Recommendation',
          '',
          `
          <h1> Have you seen ${museum.name} ? </h1>
          <img src=${museum.photo} alt=museum>
            <h3> It is located in <b> ${museum.city} </b> </h3>
            <h3> It was built in <b> ${museum.builtYear} </b> </h3>
            <h2> Here's some information about ${museum.name} </h2>
            <h3> ${museum.information} </h3>
            `
        );
        await sendMailService.call();
      },
      null,
      true,
      'Europe/Istanbul'
    );

    job.start();
  }
}

export default MailCronService;
