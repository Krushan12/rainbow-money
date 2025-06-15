import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://krushantw:Krushan212@rainbow-money.fsh9ngp.mongodb.net/?retryWrites=true&w=majority&appName=rainbow-money';

async function dropPanNumberIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the index
    await mongoose.connection.db.collection('clients').dropIndex('panNumber_1');
    console.log('Successfully dropped panNumber index');
  } catch (error) {
    if (error.code === 27) {
      console.log('Index does not exist - moving forward');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

dropPanNumberIndex();
