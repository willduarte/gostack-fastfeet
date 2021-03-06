import { Op } from 'sequelize'
import { startOfDay, endOfDay } from 'date-fns'

import * as Yup from 'yup'
import Order from '../models/Order'
import OrderIssue from '../models/OrderIssue'
import File from '../models/File'

class DeliveryController {
  async issues(req, res) {
    const { id } = req.params

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderIssue,
          as: 'issues',
        },
      ],
    })

    return res.json(order)
  }

  async store(req, res) {
    const { id: order_id } = req.params
    const { description } = req.body

    const order = await Order.findByPk(order_id)

    if (!order) {
      return res.status(400).json({ error: 'Invalid order' })
    }

    if (order.canceled_at) {
      return res.status(409).json({ error: 'Order has been canceled' })
    }

    const orderIssue = await OrderIssue.create({ order_id, description })

    return res.json(orderIssue)
  }

  async update(req, res) {
    const now = new Date()
    const hour = now.getHours()

    const data = {
      id: req.params.id,
      order_id: req.params.order_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      file: req.file,
      hour,
      now,
    }

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      order_id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date().when('start_date', (date, field) => (!date ? field.required() : field)),
      file: Yup.object().when('end_date', (date, field) => (date ? field.required() : field)),
      hour: Yup.number().when('start_date', (date, field) =>
        date
          ? field
              .required()
              .min(8, 'Withdrawals are allowed from 08:00 to 18:00')
              .max(17, 'Withdrawals are allowed from 08:00 to 18:00')
          : field
      ),
    })

    try {
      await schema.validate(data)
    } catch (error) {
      return res.status(400).json({ errors: error.errors })
    }

    const order = await Order.findOne({
      where: { id: data.order_id, deliveryman_id: data.id },
    })

    if (!order) {
      return res.status(400).json({ error: 'Invalid order' })
    }

    if (data.start_date) {
      if (order.start_date) {
        return res.status(409).json({ error: 'Order has already been withdrawn' })
      }

      if (order.canceled_at) {
        return res.status(409).json({ error: 'Order has been canceled' })
      }

      const todayOrders = await Order.count({
        where: {
          deliveryman_id: data.id,
          canceled_at: null,
          start_date: {
            [Op.between]: [startOfDay(now), endOfDay(now)],
          },
        },
      })

      if (todayOrders >= 5) {
        return res.status(409).json({ error: 'Order cannot be withdrawn, maximum limit reached' })
      }

      const { id, start_date, end_date, recipient_id } = await order.update({ start_date: data.start_date })

      return res.json({
        id,
        start_date,
        end_date,
        recipient_id,
      })
    }

    if (data.end_date) {
      if (!order.start_date) {
        return res.status(409).json({ error: 'Order cannot be delivered without withdraw' })
      }

      if (order.end_date) {
        return res.status(409).json({ error: 'Order has already been delivered' })
      }

      if (!data.file) {
        return res.status(409).json({ error: 'Order cannot be delivered without signature' })
      }

      const { originalname: name, filename: path } = req.file

      const file = await File.create({
        name,
        path,
      })

      const { id, start_date, end_date, recipient_id } = await order.update({
        end_date: data.end_date,
        signature_id: file.id,
      })

      return res.json({
        id,
        start_date,
        end_date,
        recipient_id,
      })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default new DeliveryController()
