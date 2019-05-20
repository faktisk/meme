export default ({ title, selected, options, setter, allowNone }) => (
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
