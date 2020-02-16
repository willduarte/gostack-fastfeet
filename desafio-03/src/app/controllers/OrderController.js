import Order from '../models/Order'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
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
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    })

    return res.json(orders)
  }

  async store(req, res) {
    const order = await Order.create(req.body)

    return res.json(order)
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await order.update(req.body)

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    })
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    await order.destroy()

    return res.json()
  }
}

export default new OrderController()
