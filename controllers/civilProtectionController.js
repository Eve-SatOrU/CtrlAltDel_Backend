const User = require('../models/user');
const AmbulanceRequest = require('../models/AmbulanceRequest');
const Notification = require('../models/notification');

exports.postAmbulanceForm = async (req, res) => {
    const { currentLocation, roadCondition, patientStateDescription,maladeSituationDescription  } = req.body;
    
    try {
        const ambulanceRequest = await AmbulanceRequest.create({
        currentLocation,
        roadCondition,
        patientStateDescription,
        maladeSituationDescription,
        userId: req.session.userId,
        });
    
      const policeUsers = await User.findAll({ where: { role: 'police' } });
      for (const policeUser of policeUsers) {
        await Notification.create({
          content: `Ambulance request - Road clearance needed for user ${req.session.user.userName}`,
          userId: policeUser.id,
          type: 'police', 
        });
      }
            const hospitalUsers = await User.findAll({ where: { role: 'hospital' } });
            for (const hospitalUser of hospitalUsers) {
              await Notification.create({
                content: `Ambulance request - Malade situation: ${maladeSituationDescription}`,
                userId: hospitalUser.id,
                type: 'hospital', 
              });
            }      
      res.status(201).json({ message: 'Ambulance form submitted successfully', ambulanceRequest });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    }