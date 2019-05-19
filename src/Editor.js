import Dropzone from 'react-dropzone';

const ColorPicker = ({ title, selected, options, setter, allowNone }) => (
    <div className="m-editor__overlay">
        <h2>{title}</h2>
        <ul className="checkbox-group">
            {allowNone && (
                <li>
                    <label>
                        <input
                            type="radio"
                            value=""
                            onChange={setter}
                            checked={selected === ''}
                        />{' '}
                        None
                    </label>
                </li>
            )}
            {options.map(c => (
                <li key={c}>
                    <label>
                        <input
                            className="m-editor__swatch"
                            style={{ backgroundColor: c }}
                            type="radio"
                            checked={c === selected}
                            onChange={setter}
                            value={c}
                        />
                    </label>
                </li>
            ))}
        </ul>
    </div>
);

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
            className="form-control form-control-sm"
            value={size}
            onChange={setAttribute('size')}>
            {sizeOpts.map(o => (
                <option value={o.name} key={o.name}>
                    {o.name}: {o.width}x{o.height}
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

        <select
            className="form-control form-control-sm"
            value={fontSize}
            onChange={setAttribute('fontSize')}>
            <option value="" disabled>
                Select a font size
            </option>

            {fontSizeOpts.map(o => (
                <option value={o.value} key={o.value}>
                    {o.text}
                </option>
            ))}
        </select>

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
