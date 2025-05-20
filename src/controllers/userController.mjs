import getDBConnection from '../db.mjs';



export const getAllUsers = async (req, res) => {
  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate(); // connect only when this endpoint is hit

    const [results] = await sequelize.query('SELECT * FROM users');
    res.status(200).json({ message: 'User list', data: results });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// export const loginUser = async (req, res) => {
//   const { password, emailorphone } = req.body;

//   if ((!password && !emailorphone)) {
//     return res.status(400).json({ message: 'Email or phone and password are required' });
//   }

//   try {
//     const sequelize = getDBConnection();
//     await sequelize.authenticate();

//     let query;
//     let replacements;

//     if (emailorphone) {
//       query = 'SELECT id, name, email FROM users WHERE (email = ? AND password = ?) OR  (phone = ? AND password = ?)';
//       replacements = [emailorphone, password];
//     } 

//     const [users] = await sequelize.query(query, { replacements });

//     if (users.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];
//     res.status(200).json({
//       message: 'Login successful',
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Database error', error: err.message });
//   }
// };

export const loginUser = async (req, res) => {
  const { password, emailorphone } = req.body;

  if (!password || !emailorphone) {
    return res.status(400).json({ message: 'Email or phone and password are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const query = `
      SELECT id, name, email
      FROM users
      WHERE (email = ? AND password = ?) OR (phone = ? AND password = ?)
    `;
    const replacements = [emailorphone, password, emailorphone, password];

    const [users] = await sequelize.query(query, { replacements });

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [results] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
      replacements: [id],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User found', data: results[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

export const signupUser = async (req, res) => {
  const { email, password, name, phone ,address ,image} = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the email or phone already exists
    const [existingUser] = await sequelize.query(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      {
        replacements: [email, phone],
      }
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email or phone already exists' });
    }

    // Hash the password before saving it
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await sequelize.query(
      'INSERT INTO users (email, password, name, phone ,address , image) VALUES (?, ?, ?, ?, ? , ?)',
      {
        replacements: [email, password, name, phone, address, image],
      }
    );

    // Respond with success
    res.status(200).json({ message: 'User successfully registered' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export const updateFCM = async (req, res) => {
  const { id } = req.query;  // User ID from query parameters
  const { fcmToken } = req.body;  // New FCM token from request body

  // Validate input
  if (!id || !fcmToken) {
    return res.status(400).json({ message: 'User ID and FCM token are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the user exists
    const [user] = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [id],
      }
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the FCM token for the user
    await sequelize.query(
      'UPDATE users SET FCM = ? WHERE id = ?',
      {
        replacements: [fcmToken, id],
      }
    );

    res.status(200).json({ message: 'FCM token updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// export const updateUserDetails = async (req, res) => {
//   const { id } = req.query;  // User ID from query parameters
//   const { name, address, image } = req.body;  // New user details from the request body

//   // Validate input
//   if (!id || (!name && !address && !image)) {
//     return res.status(400).json({ message: 'User ID and at least one field (name, address, or image) are required' });
//   }

//   try {
//     const sequelize = getDBConnection();
//     await sequelize.authenticate();

//     // Check if the user exists
//     const [user] = await sequelize.query(
//       'SELECT * FROM users WHERE id = ?',
//       {
//         replacements: [id],
//       }
//     );

//     if (user.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prepare the query to update the user
//     const updateQuery = `
//       UPDATE users SET
//         name = ?,
//         address =?,
//         image = ?
//       WHERE id = ?`;

//     // Execute the update query
//     await sequelize.query(updateQuery, {
//       replacements: [name, address, image, id],
//     });

//     res.status(200).json({ message: 'User details updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Database error', error: err.message });
//   }
// };

export const updateUserDetails = async (req, res) => {
  const { id } = req.query;
  const { name, address } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!id || (!name && !address && !image)) {
    return res.status(400).json({ message: 'User ID and at least one field (name, address, or image) are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [user] = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      { replacements: [id] }
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build fields and replacements dynamically
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (address) {
      fields.push('address = ?');
      values.push(address);
    }
    if (image) {
      fields.push('image = ?');
      values.push(image);
    }

    values.push(id); // for WHERE clause

    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    await sequelize.query(updateQuery, { replacements: values });

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};


export const deleteUserAccount = async (req, res) => {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Valid user ID is required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if user exists
    const [user] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
      replacements: [id],
    });

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's status to 'deleted'
    await sequelize.query('UPDATE users SET status = 0 WHERE id = ?', {
      replacements: [id],
    });

    res.status(200).json({ message: 'User account marked as deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the user exists
    const [users] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: [email],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password
    await sequelize.query('UPDATE users SET password = ? WHERE email = ?', {
      replacements: [newPassword, email],
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export const setSubplane = async (req, res) => {
  const { id } = req.query;  // User ID from query parameters
  const { setSubplane } = req.body;  // New FCM token from request body

  // Validate input
  if (!id || !setSubplane) {
    return res.status(400).json({ message: 'setSubplane token are required' });
  }

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    // Check if the user exists
    const [user] = await sequelize.query(
      'SELECT * FROM users WHERE id = ?',
      {
        replacements: [id],
      }
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the FCM token for the user
    await sequelize.query(
      'UPDATE users SET subscriptiontype = ? WHERE id = ?',
      {
        replacements: [setSubplane, id],
      }
    );

    res.status(200).json({ message: 'setSubplane updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

