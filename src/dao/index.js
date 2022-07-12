import Dexie from "dexie";
import QuizDao from "./quizDao";
const db = new Dexie("quizDB");

const createTable = (tableName, schema) => {
  db.version(1).stores({ [tableName]: schema });
};

const quizDao = new QuizDao(db, { createTable });

export { db, quizDao };
