import { CronJob } from 'cron';
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

  public async call() {
    const to = await this.getMailList();
    const job = new CronJob(
      this.cronTime,
      async function () {
        const sendMailService = new SendMailService(
          'gmail',
          to,
          'cron',
          'cron test yo',
          ''
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
