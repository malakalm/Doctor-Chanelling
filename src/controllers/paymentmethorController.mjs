import getDBConnection from '../db.mjs';


export const getpaymentMethordDetails = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [results] = await sequelize.query('SELECT * FROM PaymentMethord WHERE id = ?', {
      replacements: [id],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'PaymentMethord not found' });
    }

    res.status(200).json({ message: 'PaymentMethord found', data: results[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
