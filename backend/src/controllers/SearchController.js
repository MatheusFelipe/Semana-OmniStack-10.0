const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const getLocation = require('../utils/getLocation');

module.exports = {
  index: (req, res) => {
    const { latitude, longitude, techs } = req.query;
    const techsArray = parseStringAsArray(techs);

    Dev.find(
      {
        techs: { $in: techsArray.map(tech => new RegExp(tech, 'i')) },
        location: { $near: { $geometry: getLocation({ latitude, longitude }), $maxDistance: 10000 } },
      },
      (err, devs) => res.json({ devs })
    );
  },
};
