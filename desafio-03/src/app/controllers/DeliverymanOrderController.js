import Order from '../models/Order'
import Recipient from '../models/Recipient'

class DeliverymanOrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: { deliveryman_id: req.params.id, end_date: null, canceled_at: null },
      attributes: ['start_date', 'end_date'],
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
}

export default new DeliverymanOrderController()
