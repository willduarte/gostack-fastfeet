module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_street: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address_complement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_postal_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('recipients')
  },
}
