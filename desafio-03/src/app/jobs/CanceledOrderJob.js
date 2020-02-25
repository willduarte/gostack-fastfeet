import Mail from '../../lib/Mail'

class CanceledOrderJob {
  get key() {
    return 'CanceledOrderJob'
  }

  async handle({ data }) {
    const { recipient, deliveryman } = data

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'canceled-order',
      context: {
        deliveryman: deliveryman.name,
        address: recipient.address,
      },
    })
  }
}

export default new CanceledOrderJob()
