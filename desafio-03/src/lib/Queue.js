import Bee from 'bee-queue'
import redisConfig from '../config/redis'

import NewOrderJob from '../app/jobs/NewOrderJob'
import CanceledOrderJob from '../app/jobs/CanceledOrderJob'

const jobs = [NewOrderJob, CanceledOrderJob]

class Queue {
  constructor() {
    this.queues = {}

    this.init()
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      }
    })
  }

  add(key, jobData) {
    return this.queues[key].bee.createJob(jobData).save()
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]

      bee.on('failed', this.handleFail).process(handle)
    })
  }

  handleFail(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`, err)
  }
}

export default new Queue()
