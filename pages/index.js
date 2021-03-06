import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

export default function Home() {
    const [samples, setSamples] = useState([]);

    const myFunction = (event) => {
        const pako = require('pako');
        var fr = new FileReader();

        let file = event.target.files[0];

        //a very lazy check
        if (file) {
            fr.readAsArrayBuffer(file);
        }

        fr.onload = function () {
            const inflated = pako.ungzip(new Uint8Array(fr.result), {
                to: 'string',
            });

            //searching for wav (with folder), mp3 and aiff files:

            const regex =
                /(?<=userfolder:).+wav|(?<=Value=").*mp3|(?<=Value=").*aiff/gm;

            let found = inflated.match(regex);

            //make matches unique:

            let uniqueFound = [...new Set(found)];

            //a few replacements for readability (spaces and ampersands)

            let foundSpaces = uniqueFound.map((element) =>
                element.replaceAll('%20', ' ')
            );
            let foundAmpersands = foundSpaces.map((element) =>
                element.replaceAll('&amp;', '&')
            );
            setSamples([...foundAmpersands]);
        };
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Ableton samples</title>
                <meta
                    name="description"
                    content="Ableton samples. Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <figure className="px-10 pt-10">
                    <Image
                        src={'/pexels-tstudio-7095424.jpg'}
                        className="rounded-xl"
                        width="400"
                        height="200"
                        alt="ableton-image"
                    />
                </figure>
                <div className="card text-center shadow-2xl ">
                    <div className="card-body ">
                        <h2 className="card-title">Ableton samples</h2>
                        <p>Please select your Ableton project file (*.als)</p>
                        <p>
                            Used samples (.wav, .mp3 and .aiff) will be shown
                            below.{' '}
                        </p>
                        <div className="justify-center card-actions">
                            <input
                                type="file"
                                name="inputfile"
                                className="inputfile btn-primary btn-outline btn-accent mt-2"
                                accept=".als"
                                onChange={myFunction}
                            />
                        </div>

                        {samples.map((element) => (
                            <>
                                <p className="text-sm">{element}</p>
                                <span>&nbsp;&nbsp;</span>
                            </>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
