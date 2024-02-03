// load user from localstorage
import {LOGGED_USER} from "./local-storage-constants.js";

const loggedUser = JSON.parse(localStorage.getItem(LOGGED_USER));