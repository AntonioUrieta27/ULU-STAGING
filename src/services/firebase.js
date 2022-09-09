import firebase from 'firebase';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import 'firebase/app-check';

import { firebaseConfig } from '../config/db';


if(!app.apps.length){
    app.initializeApp(firebaseConfig);
}

const appCheck = firebase.appCheck();
appCheck.activate("6Ldv9UAbAAAAANqcfTgquWQhxKI62dkA06RS7L1B");

export const auth = app.auth();

export const storage = app.storage();

export const db = firebase.database();
