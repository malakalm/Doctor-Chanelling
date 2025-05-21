import cron from 'node-cron';
import { getDBConnection } from './db.js'; // Adjust to your DB connection file

// Cron job: runs daily at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running subscription expiry check...`);

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [expiredSubscriptions] = await sequelize.query(
      `UPDATE users JOIN usersubscriptions ON users.id = usersubscriptions.userid SET users.status = 0 WHERE usersubscriptions.Expiredate < NOW();`
    );
    
    await sequelize.query(
      `INSERT INTO usersubscriptionsarchived (userid, perchesDate,Expiredate,subid, archivedDate)
              SELECT userid, perchesDate,Expiredate,subid,NOW()
              FROM usersubscriptions
              WHERE usersubscriptions.Expiredate < NOW();;`
    );
     
    await sequelize.query(
      `DELETE usersubscriptions 
              WHERE usersubscriptions.Expiredate < NOW();;`
    );


    if (expiredSubscriptions.length > 0) {
      console.log(`Found ${expiredSubscriptions.length} expired subscriptions:`);
      expiredSubscriptions.forEach(sub => {
        console.log(` - User ID: ${sub.userid}, Expired on: ${sub.Expiredate}`);
      });

      // Optional: perform any action (e.g. notify, deactivate, etc.)
    } else {
      console.log('No expired subscriptions found.');
    }
  } catch (error) {
    console.error('Error running subscription expiry check:', error.message);
  }
});
