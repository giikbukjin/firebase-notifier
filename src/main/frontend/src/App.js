import './App.css';
import React, { useEffect } from 'react';
import Main from "./Components/Main/Main";
import { initializeApp } from "firebase/app";
import { activate, fetchAndActivate, fetchConfig, getRemoteConfig, getValue } from "firebase/remote-config";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

function App() {
    const [greet, setGreet] = React.useState("");
    const app = initializeApp(firebaseConfig);
    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 0;

    useEffect(() => {
        let greeting = '';
        fetchAndActivate(remoteConfig)
            .then(() => {
                greeting = getValue(remoteConfig, 'greet');
                setGreet(greeting._value);
            })
            .catch((err) => {
                console.log("Failed to fetch remote config", err);
            });
    }, []);

    return (
        <>
            <Main greet={ greet } />
        </>
    );
}

export default App;