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
