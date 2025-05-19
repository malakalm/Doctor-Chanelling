import getDBConnection from '../db.mjs';


export const createAppoinment = async (req, res) => {
  const { doctorid, dttappoinment, userid, venueid  } = req.body;

//   // Validate input
//   if (!email || !password || !name) {
//     return res.status(400).json({ message: 'Email, password, and name are required' });
//   }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the email or phone already exists
    const [existingUser] = await sequelize.query(
      'SELECT * FROM appoinments WHERE doctorid = ? AND userid = ?  AND dttappoinment = ? AND venueid = ? AND status = 1',
      {
        replacements: [doctorid, userid ,dttappoinment , venueid],
      }
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'AllRedy Create An Appoinment' });
    }

    // Hash the password before saving it
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await sequelize.query(
      'INSERT INTO appoinments (doctorid, dttappoinment, userid, venueid ,status ) VALUES (?, ?, ?, ?, ? , ?)',
      {
        replacements: [doctorid, userid ,dttappoinment , venueid],
      }
    );

    // Respond with success
    res.status(200).json({ message: 'Appoinment successfully Created' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};