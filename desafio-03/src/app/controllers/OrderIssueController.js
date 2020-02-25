import Sequelize, { Op } from 'sequelize'
import OrderIssue from '../models/OrderIssue'
import Order from '../models/Order'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'

import CanceledOrderJob from '../jobs/CanceledOrderJob'
import Queue from '../../lib/Queue'

class OrderIssueController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        canceled_at: null,
        end_date: null,
        [Op.any]: Sequelize.where(Sequelize.col('issues.id'), { [Op.ne]: null }),
      },
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: OrderIssue,
          as: 'issues',
          attributes: ['id', 'description', 'created_at'],
        },
      ],
    })

    return res.json(orders)
  }

  async cancel(req, res) {
    const { id } = req.params

    const orderIssue = await OrderIssue.findByPk(id)

    const order = await Order.findByPk(orderIssue.order_id, {
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
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    })

    if (!order) {
      return res.status(400).json({ error: 'Invalid order' })
    }

    if (order.canceled_at) {
      return res.status(409).json({ error: 'Order has been canceled' })
    }

    await order.update({ canceled_at: new Date() })

    Queue.add(CanceledOrderJob.key, {
      recipient: order.recipient,
      deliveryman: order.deliveryman,
    })

    return res.json(order)
  }
}

export default new OrderIssueController()
