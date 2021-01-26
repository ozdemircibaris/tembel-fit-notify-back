module.exports = (sequelize, Sequelize) => {
    const notificationsModel = sequelize.define('notificationsModel', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    })
    return notificationsModel;
}