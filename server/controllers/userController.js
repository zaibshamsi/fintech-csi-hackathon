const User = require('../models/User');


exports.updateUserSettings = async (req, res) => {
    const { fraudAlertLimit } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.fraudAlertLimit = fraudAlertLimit ?? user.fraudAlertLimit;
            
            const updatedUser = await user.save();

            res.json({
                success: true,
                fraudAlertLimit: updatedUser.fraudAlertLimit,
                message: 'Settings updated successfully'
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

