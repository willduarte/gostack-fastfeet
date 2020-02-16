import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class DeliverymanController {
  async index(req, res, next) {
    const deliverymen = await Deliveryman.findAll()

    return res.json(deliverymen)
  }

  async store(req, res, next) {
    const isValid = await Deliveryman.validator().isValid(req.body)

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const { name, avatar_id, email } = req.body

    const deliveryman = await Deliveryman.create({
      name,
      avatar_id,
      email,
    })

    return res.json(deliveryman)
  }

  async update(req, res, next) {
    const isValid = await Deliveryman.validator().isValid(req.body)

    if (!isValid) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' })
    }

    if (req.body.avatar_id) {
      const file = await File.findByPk(req.body.avatar_id)

      if (!file) {
        return res.status(404).json({ error: 'Avatar not found' })
      }
    }

    const { id, name, avatar_id, email } = await deliveryman.update(req.body)

    return res.json({
      id,
      name,
      avatar_id,
      email,
    })
  }

  async delete(req, res, next) {
    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) return res.status(404).json({ error: 'Deliveryman not found' })

    await deliveryman.destroy()

    return res.status(200).json()
  }
}

export default new DeliverymanController()
