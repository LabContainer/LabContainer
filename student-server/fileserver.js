let config = {
    fsRoot: '/home/parth/Documents/Github/CodeCapture/student-server',
    rootName: 'Root folder',
    port: process.env.PORT || '3020',
    host: process.env.HOST || 'localhost'
  };
  
import pkg from '@opuscapita/filemanager-server'
const { middleware, server, logger } = pkg;
server.run(config);