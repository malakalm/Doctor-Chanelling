import getDBConnection from '../db.mjs';


export const getsubscriptionsdDetails = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [results] = await sequelize.query('SELECT * FROM PaymentMethord INNER JOIN subscriptions ON PaymentMethord.id = subscriptions.paymentMethordID WHERE PaymentMethord.id = ?', {
      replacements: [id],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'subscriptions not found' });
    }

    res.status(200).json({ message: 'subscriptions found', data: results });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};




export const CreateUserSubcription = async (req, res) => {
  const { userid, subid, daysvalide} = req.body;

  // Validate input
  if (!userid || !subid || !daysvalide) {
    return res.status(400).json({ message: 'userid, subid, and daysvalide are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the email or phone already exists
    const [existingUser] = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [userid],
      }
    );

    if (existingUser.length <= 0) {
      return res.status(409).json({ message: 'user not exists' });
    }
    
      const now = new Date();
      const perchesDate = now.toISOString().slice(0, 19).replace('T', ' ');
      const expireDateObj = new Date(now);
      expireDateObj.setDate(now.getDate() + parseInt(daysvalide));
      const expireDate = expireDateObj.toISOString().slice(0, 19).replace('T', ' ');
    // Hash the password before saving it
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await sequelize.query(
      'INSERT INTO usersubscriptions (userid, perchesDate, Expiredate, subid) VALUES (?, ?, ?, ?)',
      {
        replacements: [userid, perchesDate, expireDate, subid],
      }
    );

    // Respond with success
    res.status(200).json({ message: 'User successfully registered' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};