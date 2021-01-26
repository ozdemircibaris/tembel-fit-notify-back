module.exports = (sequelize, Sequelize) => {
    const tokensModel = sequelize.define('tokensModel', {
        token: {
            type: Sequelize.STRING,
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    })
    return tokensModel;
}