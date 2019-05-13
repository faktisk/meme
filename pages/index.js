import MemeGenerator from '../src/MemeGenerator';
import Head from 'next/head';
import '../src/main.scss';

export default class Index extends React.Component {
    render() {
        return (
            <div className="pt-4">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1" />
                    <meta content="IE=edge,chrome=1" httpEquiv="X-UA-Compatible" />
                    <title>Faktisk meme</title>
                </Head>

                <MemeGenerator />
            </div>
        );
    }
}
