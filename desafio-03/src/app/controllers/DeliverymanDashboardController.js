import { Op } from 'sequelize'
import Order from '../models/Order'
import Recipient from '../models/Recipient'
import File from '../models/File'

class DeliverymanDashboardController {
  async pending(req, res) {
    const orders = await Order.findAll({
      where: { deliveryman_id: req.params.id, end_date: null, canceled_at: null },
      attributes: ['id', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'address_street',
            'address_number',
            'address_complement',
            'address_state',
            'address_city',
            'address_postal_code',
            'address',
          ],
        },
      ],
    })

    return res.json(orders)
  }

  async finished(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'address_street',
            'address_number',
            'address_complement',
            'address_state',
            'address_city',
            'address_postal_code',
            'address',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    })

    return res.json(orders)
  }
}

export default new DeliverymanDashboardController()
