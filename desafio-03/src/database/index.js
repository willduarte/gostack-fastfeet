import Sequelize from 'sequelize'

import User from '../app/models/User'
import Recipient from '../app/models/Recipient'
import File from '../app/models/File'
import Deliveryman from '../app/models/Deliveryman'
import Order from '../app/models/Order'
import OrderIssue from '../app/models/OrderIssue'

import dbConfig from '../config/database'

const models = [User, Recipient, File, Deliveryman, Order, OrderIssue]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(dbConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
