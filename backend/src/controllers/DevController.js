const axios = require('axios');

const Dev = require('../models/Dev');
const { findNearConnections, findNearConnectionsByTechs, sendMessage } = require('../websocket');
const parseStringAsArray = require('../utils/parseStringAsArray');
const getLocation = require('../utils/getLocation');

module.exports = {
  index: (req, res) => Dev.find({}, (err, devs) => res.json({ devs })),

  show: (req, res) => Dev.findOne({ github_username: req.params.github_username }, (err, dev) => res.json({ dev })),

  destroy: (req, res) =>
    Dev.findOneAndDelete({ github_username: req.params.github_username }, { useFindAndModify: false }, (err, dev) => {
      res.json(dev);
      if (dev) {
        const [longitude, latitude] = dev.location.coordinates;
        sendMessage(findNearConnections({ latitude, longitude }), 'remove-dev', dev);
      }
    }),

  store: async (req, res) => {
    const { github_username, techs, latitude, longitude } = req.body;

    const techsArray = parseStringAsArray(techs);
    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const {
        data: { name, login, avatar_url, bio },
      } = await axios.get(`https://api.github.com/users/${github_username}`);

      dev = await Dev.create({
        github_username,
        name: name || login,
        avatar_url,
        bio,
        techs: techsArray,
        location: getLocation({ latitude, longitude }),
      });

      const sendSocketMessageTo = findNearConnectionsByTechs({ latitude, longitude }, techsArray);
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json({ dev });
  },

  update: (req, res) => {
    const { github_username } = req.params;
    const { techs, latitude, longitude, name, avatar_url, bio } = req.body;
    return Dev.findOneAndUpdate(
      { github_username },
      { avatar_url, bio, name, location: getLocation({ latitude, longitude }), techs: parseStringAsArray(techs) },
      { useFindAndModify: false, new: true },
      (err, dev) => res.json({ dev })
    );
  },
};
