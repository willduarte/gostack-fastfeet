import Sequelize, { Model } from 'sequelize'

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_number: Sequelize.INTEGER,
        address_complement: Sequelize.STRING,
        address_state: Sequelize.STRING,
        address_city: Sequelize.STRING,
        address_postal_code: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Recipient
