const { Permission } = require('../../models/Administration/Permission');
const { Market } = require('../../models/MarketAndBranch/Market');

module.exports.register = async (req, res) => {
  try {
    const { permission } = req.body;

    let updated;
    if (permission._id) {
      updated = await Permission.findByIdAndUpdate(permission._id, {
        ...permission,
      });
    } else {
      updated = new Permission({ ...permission });
      await updated.save();
      await Market.findByIdAndUpdate(permission.market, {
        permission: updated._id,
      });
    }

    updated = await Permission.findById(updated._id);
    res.status(201).send(updated);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.get = async (req, res) => {
  try {
    const { permissionid } = req.body;
    const permission = await Permission.findById(permissionid);
    res.status(200).send(permission ? permission : false);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
