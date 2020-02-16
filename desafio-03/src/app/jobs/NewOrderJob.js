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
        address: `${recipient.address_street}, ${recipient.address_number} -
          ${recipient.address_complement} - ${recipient.address_state} -
          ${recipient.address_city} - CEP: ${recipient.address_postal_code}`,
      },
    })
  }
}

export default new NewOrderJob()
