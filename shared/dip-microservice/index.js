const ioModule = require('./io/module');
const ioDeps = ioModule();


class DipMicroservice {
  constructor(io) {
    this.io = io;
  }

  async bootstrap(Microservice, config) {
    this.config = config;

    this.app = new Microservice({
      amqp: this.io.amqp,
      router: this.io.router,
      log: this.io.log,
      config: this.config,
    });

    try {
      await this.io.amqp.connect(this.config.amqpBroker);
      await this.app.bootstrap();
      await new Promise((resolve, reject) => {
        this.io.http.listen(this.config.httpPort, (err) => {
          if (err) {
            reject(new Error(err));
            return;
          }

          const name = `${process.env.npm_package_name}.v${process.env.npm_package_version}`;
          this.io.log.info(`Microservice ${name} is listening http at http://localhost:${this.config.httpPort}`);
          resolve();
        })
      })
    } catch (err) {
      this.log.error(err);
      throw new Error(err);
    }
  }
}

module.exports = new DipMicroservice(ioDeps);
