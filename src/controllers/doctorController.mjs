import getDBConnection from '../db.mjs';

export const getAvailableDoctors = async (req, res) => {
  try {
      const { id } = req.query;
    const sequelize = getDBConnection();
    await sequelize.authenticate(); 

    const [results] = await sequelize.query('SELECT image,DoctorDetail.id, specialization, qualification, experience_years, hospital_name, phone, email, address, name  FROM DoctorDetail INNER JOIN AddDoctorToPations ON DoctorDetail.id = AddDoctorToPations.DoctorId  WHERE istatus = 1 AND Userid = ?'
    ,{replacements: [id],});

    if (results.length === 0) {
      return res.status(404).json({ message: 'No available doctors found' });
    }
    else{

       res.status(200).json({ message: 'User list', data: results });
    }
   
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};



export const getDoctorVenues = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

    const [results] = await sequelize.query('SELECT * FROM Venues WHERE Doctorid = ?', {
      replacements: [id],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Venues not found' });
    }

    res.status(200).json({ message: 'Venues found', data: results });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};


export const AddDoctorToPations = async (req, res) => {
  const { Doctorid, Userid} = req.body;



  try {
    const sequelize = getDBConnection();
    await sequelize.authenticate();

  
    await sequelize.query(
      'INSERT INTO AddDoctorToPations (Userid,DoctorId ) VALUES (?, ?)',
      {
        replacements: [Doctorid, Userid],
      }
    );

    // Respond with success
    res.status(200).json({ message: 'User Add successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};
