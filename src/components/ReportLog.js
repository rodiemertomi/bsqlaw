import { arrayUnion, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const reportLog = async string => {
  const logRef = doc(db, 'reports', 'LOGS')
  const log = {
    description: string,
    timestamp: new Date(),
  }
  const data = {
    logArray: arrayUnion(log),
  }

  await setDoc(logRef, data, { merge: true })
}

export default reportLog
