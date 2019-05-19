import Dropzone from 'react-dropzone';

export default ({
    onDrop,
    onPaste,
    setAttribute,
    imageScale,
    headlineText,
    textAlign,
    textAlignOpts,
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

        <div className="m-editor__overlay">
            <h2>Overlay Color</h2>
            <ul className="checkbox-group">
                <li>
                    <label>
                        <input
                            type="radio"
                            name="overlay"
                            value=""
                            onChange={setAttribute('overlayColor')}
                        />{' '}
                        None
                    </label>
                </li>
                {overlayColorOpts.map(c => (
                    <li key={c}>
                        <label>
                            <input
                                className="m-editor__swatch"
                                style={{ backgroundColor: c }}
                                type="radio"
                                name="overlay"
                                checked={c === overlayColor}
                                onChange={setAttribute('overlayColor')}
                                value={c}
                            />
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    </form>
);
