import Deliveryman from '../models/Deliveryman'

class DeliverymanController {
  async index(req, res, next) {
    return res.json({ ok: 'Deliverymen index' })
  }

  async store(req, res, next) {
    return res.json({ ok: 'Deliverymen store' })
  }

  async update(req, res, next) {
    return res.json({ ok: 'Deliverymen update' })
  }

  async delete(req, res, next) {
    return res.json({ ok: 'Deliverymen delete' })
  }
}

export default new DeliverymanController()
