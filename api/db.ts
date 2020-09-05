import * as mongoose from 'mongoose';

async function setDb(): Promise<any> {
  let dbURI;

  if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_URI;
  } else if (process.env.NODE_ENV === 'test') {
    dbURI = process.env.MONGODB_URI_TEST;
  } else {
    dbURI = process.env.MONGODB_URI_LOCAL;
  }

  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
}

export default setDb;
