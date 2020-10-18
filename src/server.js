import debug from 'debug';
import app from './app';

let port = '';

// Normaliza a porta utilizada pelo servidor
function normalizePort(val) {
  const porta = parseInt(val, 10);
  if (Number.isNaN(porta)) {
    return val;
  }
  if (porta >= 0) {
    return porta;
  }
  return false;
}

// Implementação do evento 'error'
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Implementação do evento 'listening'
function onListening() {
  const addr = app.address();
  const bind = typeof port === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

// Configurar a porta
port = normalizePort(process.env.PORT || '3333');
app.set('port', port);

// Inicializar o servidor
app.listen(port);
app.on('error', onError);
app.on('listening', onListening);
console.log(`API rodando na porta ${port}`);
