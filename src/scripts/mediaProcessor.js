const mediaProcessorService = require('./services/mediaProcessorService');

async function startMediaProcessor() {
  try {
    console.log('Starting Media Processor Service...');
    await mediaProcessorService.startProcessing();
    console.log('Media Processor Service started successfully');
  } catch (error) {
    console.error('Failed to start Media Processor Service:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Media Processor Service...');
  await mediaProcessorService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Media Processor Service...');
  await mediaProcessorService.disconnect();
  process.exit(0);
});

startMediaProcessor(); 
