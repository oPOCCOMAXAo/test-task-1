const { sleep } = require("./utils");
const { Reserved } = require("../db");

module.exports = class Service {
  running = false;

  /**
   * @param sender {ISender} - notification sender
   * @param tag {String} - unique tag for current notification
   * @param notificationInterval {Number} - notification interval before reserved time
   * @param updateInterval {Number} - db polling interval
   */
  constructor(sender, tag, notificationInterval, updateInterval = 60000) {
    this.sender = sender;
    this.tag = tag;
    this.notificationInterval = notificationInterval;
    this.interval = updateInterval;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.#next();
  }

  stop() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.running = false;
  }

  #next = async () => {
    await this.#process();
    if (this.running) {
      this.timer = setTimeout(this.#next, this.interval);
    }
  };

  #process = async () => {
    // selection of all slots without notification in next interval
    /** @type {ReadyDocument[]} */
    const docs = await Reserved.findReadyForNotification(
      Date.now() + this.notificationInterval + this.interval,
      this.tag
    );

    // await for all documents has been processed
    const promises = [];
    for (const doc of docs) {
      promises.push(this.#processSingle(doc));
    }
    await Promise.all(promises);

    // mark all as notified
    await Reserved.addTag(
      docs.map((d) => d._id),
      this.tag
    );
  };

  /**
   * @param doc {ReadyDocument}
   */
  #processSingle = async (doc) => {
    // await for correct time
    let sleepTime = doc.time - this.notificationInterval - Date.now();
    if (sleepTime > 0) {
      await sleep(sleepTime);
    }

    // and send message
    this.sender.send({
      name: doc.user && doc.user.name,
      spec: doc.doctor && doc.doctor.spec,
      time: doc.time,
      operationTime: Date.now(),
    });
  };
};
