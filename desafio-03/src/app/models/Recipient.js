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
        address: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.address_street}, ${this.address_number} - ${this.address_complement} - ${this.address_state} - ${this.address_city} - CEP: ${this.address_postal_code}`
          },
        },
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Recipient
