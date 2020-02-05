import * as Yup from 'yup'

import Recipient from '../models/Recipient'

class RecipientController {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input' })
    }

    const {
      name,
      address_street,
      address_number,
      address_complement,
      address_state,
      address_city,
      address_postal_code,
    } = req.body

    const recipient = await Recipient.create({
      name,
      address_street,
      address_number,
      address_complement,
      address_state,
      address_city,
      address_postal_code,
    })

    return res.json(recipient)
  }

  async update(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input' })
    }

    const recipient = await Recipient.findByPk(req.params.id)

    if (!recipient) {
      return res.status(404).json({ error: 'recipient not found' })
    }

    const {
      name,
      address_street,
      address_number,
      address_complement,
      address_state,
      address_city,
      address_postal_code,
    } = await recipient.update(req.body)

    return res.json({
      name,
      address_street,
      address_number,
      address_complement,
      address_state,
      address_city,
      address_postal_code,
    })
  }
}

export default new RecipientController()
