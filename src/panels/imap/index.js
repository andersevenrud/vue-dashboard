const Imap = require('imap');

function getInboxMessages(cfg, client) {
  const openInbox = () => new Promise((resolve, reject) => {
    client.openBox('INBOX', true, (err, res) => {
      return err ? reject(err) : resolve(res);
    });
  });

  const readMessage = (msg, seqno) => new Promise((resolve, reject) => {
    let data = {};

    msg.on('body', (stream) => {
      let buffer = '';
      stream.on('data', (chunk) => (buffer += chunk.toString('utf8')));
      stream.on('end', () => (data = Imap.parseHeader(buffer)));
    });

    msg.once('error', (err) => {
      console.warn('message error', err);
      data = null;
      resolve(null);
    });

    msg.once('end', () => {
      if ( data !== null ) {
        resolve(data);
      }
    });
  });

  const getMessages = (box) => new Promise((resolve, reject) => {
    const f = client.seq.fetch('1:' + String(cfg.count || 10), {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });

    const messages = [];
    f.on('message', (msg, seqno) => {
      readMessage(msg, seqno).then((msg) => {
        messages.push(msg);
      }).catch((err) => {
        console.warn('error', seqno, err);
      });
    });

    f.once('error', reject);
    f.once('end', () => resolve(messages));
  });

  return new Promise((resolve, reject) => {
    openInbox().then((box) => {
      getMessages(box).then(resolve).catch(reject);
    }).catch(reject);
  });
}

function createClient(cfg, ready, end, error) {
  const client = new Imap(cfg.imap);
  client.once('ready', () => ready(client));
  client.once('end', end);
  client.connect();
}

module.exports = () => {
  let client;

  return {
    poll: function(cfg) {
      if ( client ) {
        return getInboxMessages(cfg, client);
      }

      console.log('Creating IMAP session');
      return new Promise((resolve, reject) => {
        createClient(cfg, (result) => {
          console.log('IMAP session created');
          client = result;
          this.poll(cfg).then(resolve).catch(reject);
        }, () => {
          console.log('IMAP session closed');
          client = null;
        }, (err) => {
          console.warn('IMAP session creation error', err);
          reject(err);
        });
      });
    },

    init: function(cfg, handler) {
      setInterval(() => {
        if ( client ) {
          handler(this.poll, [cfg]);
        }
      }, (60 * 1000));

      return this.poll(cfg);
    }
  };
};
