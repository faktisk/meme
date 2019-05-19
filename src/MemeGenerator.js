import Editor from './Editor';
import Canvas from './Canvas';

import settings from '../settings.json';

export default class MemeGenerator extends React.Component {
    state = {
        backgroundPosition: { x: null, y: null },
        creditText: 'Source:',
        creditSize: 12,
        downloadName: 'share',
        fontColor: 'white',
        fontFamily: 'Helvetica Neue',
        fontFamilyOpts: [
            { text: 'Helvetica Neue', value: 'Helvetica Neue' },
            {
                text: 'Haas Grot Disp (må være installert lokalt)',
                value: 'Haas Grot Disp',
            },
        ],
        fontSize: 24,
        fontSizeOpts: [
            { text: 'Small', value: 14 },
            { text: 'Medium', value: 24 },
            { text: 'Large', value: 36 },
        ],
        fontWeight: 400,
        fontWeightOpts: [
            { text: 'Light', value: 300 },
            { text: 'Normal', value: 400 },
            { text: 'Bold', value: 600 },
            { text: 'Boldest', value: 800 },
        ],
        headlineText: 'Write your own headline',
        imageScale: 1,
        imageSrc: '',
        overlayAlpha: 0.5,
        overlayColor: '#000',
        overlayColorOpts: ['#000', '#777', '#2980b9'],
        paddingRatio: 0.05,
        textAlign: 'left',
        textAlignOpts: [
            { text: 'Left', value: 'left' },
            { text: 'Center', value: 'center' },
            { text: 'Right', value: 'right' },
        ],
        textShadow: true,
        textShadowEdit: true,
        watermarkAlpha: 1,
        watermarkMaxWidthRatio: 0.25,
        watermarkSrc: '',
        watermarkOpts: [],
        width: 755,
        height: 378,
        sizeOpts: [{ name: 'Default', width: 755, height: 378 }],
        ...settings,
        background: process.browser ? new Image() : null,
        watermark: process.browser ? new Image() : null,
    };

    setAttribute = attr => event => {
        if (attr == 'watermarkSrc') {
            this.state.watermark.src = event.target.value;
        } else if (attr === 'backgroundSrc') {
            this.state.background.src = event.target.value;
        }

        const newState = {
            [attr]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value,
        };

        if (attr == 'size') {
            const found = this.state.sizeOpts.find(
                e => e.name === event.target.value
            );

            if (found) {
                newState.width = found.width;
                newState.height = found.height;
            }
        }

        this.setState(newState);
    };

    componentDidMount() {
        this.state.background.onload = () => this.forceUpdate();
        this.state.watermark.onload = () => this.forceUpdate();

        if (this.state.watermarkSrc) {
            this.state.watermark.src = this.state.watermarkSrc;
        }

        document.addEventListener('paste', this.handlePaste);
        document.addEventListener('paste', this.handlePaste);
    }

    componentWillUnmount() {
        document.removeEventListener('paste', this.handlePaste);
    }

    handleFileDrop = files => {
        const reader = new FileReader();

        reader.onload = () => {
            this.state.background.src = reader.result;
            this.forceUpdate();
        };

        reader.readAsDataURL(files[0]);
    };

    handlePaste = ev => {
        if (ev.clipboardData && ev.clipboardData.files.length) {
            const [file] = ev.clipboardData.files;

            if (file.type.indexOf('image/') === 0) {
                const reader = new FileReader();

                reader.onload = () => {
                    this.state.background.src = reader.result;
                    this.forceUpdate();
                };

                reader.readAsDataURL(file);
            }
        }
    };

    handleBackgroundPosition = pos => this.setState({ backgroundPosition: pos });

    render() {
        const model = this.state;

        return (
            <div className="container">
                <div>
                    <h1 className="my-4">
                        <img
                            src="static/img/faktisk-black.svg"
                            alt="Faktisk logo"
                            style={{ maxWidth: 150 }}
                        />
                    </h1>
                </div>

                <Editor
                    {...model}
                    setAttribute={this.setAttribute}
                    onDrop={this.handleFileDrop}
                    onPaste={this.handlePaste}
                    setSize={this.setSize}
                />
                <Canvas
                    {...model}
                    onBackgroundPosition={this.handleBackgroundPosition}
                />
            </div>
        );
    }
}
