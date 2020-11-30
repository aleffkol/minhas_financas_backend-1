'use strict';

module.exports = (sequelize, DataTypes) => {
    const Lancamentos = sequelize.define('Lancamentos', {
        descricao: DataTypes.STRING,
        data: DataTypes.DATE,
        valor: DataTypes.STRING,
        status: DataTypes.STRING,
        tipo_lancamento: DataTypes.STRING,
        status_lancamento: DataTypes.STRING,
        usuario_id: DataTypes.INTEGER,
    }, {
        freezeTableName: true,
        tableName: 'lancamentos'
    });

    Lancamentos.associate = function (models) {
        // Lancamentos.hasMany(models.Usuario, { as: 'usuarios', foreignKey: 'id' })
        Lancamentos.belongsTo(models.Usuario, {as:'usuarios', foreignKey: 'usuario_id'})
    };

    return Lancamentos;
};