import Dropzone from 'react-dropzone';
import ColorPicker from './ColorPicker';

function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
}

function aspectFor({ width, height }) {
    const r = gcd(width, height);

    return `${width / r}:${height / r}`;
}

export default ({
    onDrop,
    onPaste,
    setAttribute,
    imageScale,
    headlineText,
    textAlign,
    textAlignOpts,
    fontColor,
    fontColorOpts,
    backgroundColor,
    backgroundColorOpts,
    fontSize,
    fontSizeOpts,
    fontFamily,
    fontFamilyOpts,
    fontWeight,
    fontWeightOpts,
    textShadow,
    creditText,
    watermarkSrc,
    watermarkOpts,
    overlayColor,
    overlayColorOpts,
    size,
    sizeOpts,
}) => (
    <form className="m-editor" id="meme-editor-view">
        <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
                <div className="dropzone" id="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop image here</p>
                </div>
            )}
        </Dropzone>

        <h2>
            <label htmlFor="image-scale">Scale image</label>
        </h2>

        <input
            id="image-scale"
            type="range"
            max="4"
            min=".01"
            step=".01"
            value={imageScale}
            onChange={setAttribute('imageScale')}
        />

        <select
            className="form-control form-control-sm text-monospace"
            style={{ fontSize: '12px' }}
            value={size}
            onChange={setAttribute('size')}>
            {sizeOpts.map(o => (
                <option value={o.name} key={o.name}>
                    {aspectFor(o)} &middot; {o.name} &middot; {o.width}x{o.height}
                </option>
            ))}
        </select>

        <h2>
            <label htmlFor="headline">Headline</label>
        </h2>

        <textarea
            id="headline"
            name="headline"
            type="text"
            value={headlineText}
            onChange={setAttribute('headlineText')}
        />

        <ColorPicker
            title="Font color"
            setter={setAttribute('fontColor')}
            options={fontColorOpts}
            selected={fontColor}
        />

        <select
            className="form-control form-control-sm"
            value={textAlign}
            onChange={setAttribute('textAlign')}>
            <option value="" disabled>
                Select alignment
            </option>

            {textAlignOpts.map(o => (
                <option value={o.value} key={o.value}>
                    {o.text}
                </option>
            ))}
        </select>

        <label htmlFor="font-size">Font size</label>

        <input
            id="font-size"
            type="range"
            max="128"
            min="12"
            step="1"
            list="fontSizes"
            value={fontSize}
            onChange={setAttribute('fontSize')}
        />
        <datalist id="fontSizes">
            {fontSizeOpts.map(e => (
                <option key={e.value}>{e.value}</option>
            ))}
        </datalist>

        <select
            className="form-control form-control-sm"
            value={fontWeight}
            onChange={setAttribute('fontWeight')}>
            <option value="" disabled>
                Select a font weight
            </option>

            {fontWeightOpts.map(o => (
                <option value={o.value} key={o.value}>
                    {o.text}
                </option>
            ))}
        </select>

        <select
            className="form-control form-control-sm"
            value={fontFamily}
            onChange={setAttribute('fontFamily')}>
            <option value="" disabled>
                Select a font
            </option>
            {fontFamilyOpts.map(o => (
                <option value={o.value} key={o.value}>
                    {o.text}
                </option>
            ))}
        </select>

        <div className="checkbox-group text-shadow">
            <label>
                <input
                    className="mr-1"
                    type="checkbox"
                    checked={textShadow}
                    onChange={setAttribute('textShadow')}
                />
                Text Shadow
            </label>
        </div>

        <select
            className="form-control form-control-sm"
            value={watermarkSrc}
            onChange={setAttribute('watermarkSrc')}>
            <option value="" disabled>
                Select a watermark
            </option>

            {watermarkOpts.map(o => (
                <option value={o.value} key={o.value}>
                    {o.text}
                </option>
            ))}
        </select>

        <h2>
            <label htmlFor="credit">Credit</label>
        </h2>

        <input
            type="text"
            id="credit"
            value={creditText}
            onChange={setAttribute('creditText')}
        />

        <ColorPicker
            title="Overlay color"
            setter={setAttribute('overlayColor')}
            options={overlayColorOpts}
            selected={overlayColor}
            allowNone
        />

        <ColorPicker
            title="Background color"
            setter={setAttribute('backgroundColor')}
            options={backgroundColorOpts}
            selected={backgroundColor}
        />
    </form>
);
