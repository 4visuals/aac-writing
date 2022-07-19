import Dexie from "dexie";
import QuizDao from "./quizDao";
const db = new Dexie("quizDB");

const createTable = (tableName, schema, version = 1) => {
  return db.version(version).stores({ [tableName]: schema });
};

const quizDao = new QuizDao(db, { createTable });

export { db, quizDao };
