import Mail from '../../lib/Mail'

class NewOrderJob {
  get key() {
    return 'NewOrderJob'
  }

  async handle({ data }) {
    const { recipient, deliveryman } = data

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega disponível',
      template: 'new-order',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        address: recipient.address,
      },
    })
  }
}

export default new NewOrderJob()
