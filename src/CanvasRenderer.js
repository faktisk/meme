import classnames from 'classnames';

export default class CanvasRenderer extends React.Component {
    node = React.createRef();
    state = { drag: false };

    componentDidUpdate() {
        this.draw();
    }

    componentDidMount() {
        this.draw();

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    draw() {
        const canvas = this.node.current;
        if (!canvas) return;

        const {
            width,
            height,
            paddingRatio,
            background,
            watermark,
            watermarkMaxWidthRatio,
            watermarkAlpha,
            imageScale,
            backgroundPosition,
            backgroundColor,
            overlayColor,
            overlayAlpha,
            fontSize,
            fontFamily,
            fontColor,
            fontWeight,
            textShadow,
            textAlign,
            headlineText,
            creditSize,
            creditText,
            headlinePosition,
        } = this.props;

        var ctx = canvas.getContext('2d');
        var padding = Math.round(width * paddingRatio);

        // Reset canvas display:
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        function renderBackground(ctx) {
            // Base height and width:
            var bh = background.height;
            var bw = background.width;

            if (bh && bw) {
                // Transformed height and width:
                // Set the base position if null
                var th = bh * imageScale;
                var tw = bw * imageScale;
                var cx = backgroundPosition.x || width / 2;
                var cy = backgroundPosition.y || height / 2;

                ctx.drawImage(
                    background,
                    0,
                    0,
                    bw,
                    bh,
                    cx - tw / 2,
                    cy - th / 2,
                    tw,
                    th
                );
            }
        }

        function renderOverlay(ctx) {
            if (overlayColor) {
                ctx.save();
                ctx.globalAlpha = overlayAlpha;
                ctx.fillStyle = overlayColor;
                ctx.fillRect(0, 0, width, height);
                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }

        function renderHeadline(ctx) {
            var maxWidth = Math.round(width * 0.75);

            let x = padding;
            let y = padding;

            ctx.font = `${fontWeight} ${fontSize}pt ${fontFamily}`;
            ctx.fillStyle = fontColor;
            ctx.textBaseline = 'top';

            // Text shadow:
            if (textShadow) {
                ctx.shadowColor = '#666';
                ctx.shadowOffsetX = -2;
                ctx.shadowOffsetY = 1;
                ctx.shadowBlur = 10;
            }

            // Text alignment:
            if (textAlign == 'center') {
                ctx.textAlign = 'center';
                x = width / 2;
                y = height - height / 1.5;
                maxWidth = width - width / 3;
            } else if (textAlign == 'right') {
                ctx.textAlign = 'right';
                x = width - padding;
            } else {
                ctx.textAlign = 'left';
            }

            x += headlinePosition.x || 0;
            y += headlinePosition.y || 0;

            headlineText.split('\n').forEach((line, i) => {
                ctx.fillText(line, x, y);
                y += Math.round(fontSize * 1.5);
            });

            ctx.shadowColor = 'transparent';
        }

        function renderCredit(ctx) {
            ctx.textBaseline = 'bottom';
            ctx.textAlign = 'left';
            ctx.fillStyle = fontColor;
            ctx.font = `${fontWeight} ${creditSize}pt ${fontFamily}`;
            ctx.fillText(creditText, padding, height - padding);
        }

        function renderWatermark(ctx) {
            // Base & transformed height and width:
            var bw, bh, tw, th;
            bh = th = watermark.height;
            bw = tw = watermark.width;

            if (bh && bw) {
                // Calculate watermark maximum width:
                var mw = width * watermarkMaxWidthRatio;

                // Constrain transformed height based on maximum allowed width:
                if (mw < bw) {
                    th = bh * (mw / bw);
                    tw = mw;
                }

                ctx.globalAlpha = watermarkAlpha;

                ctx.drawImage(
                    watermark,
                    0,
                    0,
                    bw,
                    bh,
                    width - padding - tw,
                    height - padding - th,
                    tw,
                    th
                );

                ctx.globalAlpha = 1;
            }
        }

        renderBackground(ctx);
        renderOverlay(ctx);
        renderHeadline(ctx);
        renderCredit(ctx);
        renderWatermark(ctx);

        // Enable drag cursor while canvas has artwork:
        if (this.state.altKey) {
            canvas.style.cursor = 'move';
        } else if (this.state.shiftKey) {
            canvas.style.cursor = 'ns-resize';
        } else {
            canvas.style.cursor = background.width ? 'grab' : 'default';
        }
    }

    download = () => {
        if (!this.node.current) {
            return;
        }

        this.node.current.toBlob(blob => {
            const a = document.createElement('a');
            a.download = this.props.downloadName || 'share.png';
            a.href = URL.createObjectURL(blob);
            a.click();
        }, 'image/png');
    };

    canDrag = () => {
        const { width, height } = this.props.background;
        return (width && height) || this.state.altKey;
    };

    handleMouseDown = event => {
        if (this.canDrag()) {
            const {
                background,
                imageScale,
                backgroundPosition,
                headlinePosition,
                width,
                height,
            } = this.props;

            const imageWidth = (background.width * imageScale) / 2;
            const imageHeight = (background.height * imageScale) / 2;
            const origin = { x: event.clientX, y: event.clientY };

            let start;

            if (this.state.altKey) {
                start = {
                    x: headlinePosition.x || 0,
                    y: headlinePosition.y || 0,
                };
            } else {
                start = {
                    x: backgroundPosition.x || width / 2,
                    y: backgroundPosition.y || height / 2,
                };
            }

            this.setState({
                drag: {
                    origin,
                    start,
                    imageWidth,
                    imageHeight,
                },
            });
        }
    };

    handleMouseUp = () => {
        if (this.canDrag()) {
            this.setState({ drag: null });
        }
    };

    handleMouseOut = () => {
        if (this.canDrag()) {
            this.setState({ drag: null });
        }
    };

    handleMouseMove = evt => {
        if (this.state.drag) {
            evt.preventDefault();

            const {
                drag: { imageWidth, imageHeight, start, origin },
                altKey,
                shiftKey,
            } = this.state;

            const {
                width,
                height,
                onBackgroundPosition,
                onHeadlinePosition,
                onImageScale,
            } = this.props;

            const {
                width: actualWidth,
                height: actualHeight,
            } = this.node.current.getBoundingClientRect();

            const xRatio = width / actualWidth;
            const yRatio = height / actualHeight;

            const diffX = (origin.x - evt.clientX) * xRatio;
            const diffY = (origin.y - evt.clientY) * yRatio;

            if (altKey) {
                onHeadlinePosition({
                    x: start.x - diffX,
                    y: start.y - diffY,
                });
            } else if (shiftKey) {
                onImageScale(diffY / height);
            } else {
                onBackgroundPosition({
                    x: start.x - diffX,
                    y: start.y - diffY,
                });
            }
        }
    };

    handleDoubleClick = evt => {
        this.props.onBackgroundPosition({ x: 0, y: 0 });
    };

    handleKeyDown = evt => {
        if (evt.key === 'Alt') {
            this.setState({ altKey: true });
        } else if (evt.key === 'Shift') {
            this.setState({ shiftKey: true });
        }
    };

    handleKeyUp = evt => {
        if (this.state.altKey || this.state.shiftKey) {
            this.setState({ altKey: false, shiftKey: false });
        }
    };

    render() {
        const { width, height } = this.props;

        return (
            <div className="m-canvas" id="meme-canvas-view">
                <div
                    className={classnames('m-canvas__canvas', {
                        'm-canvas__portrait': height > width,
                    })}
                    id="meme-canvas">
                    <canvas
                        ref={this.node}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseMove={this.handleMouseMove}
                        // onMouseOut={this.handleMouseOut}
                        onDoubleClick={this.handleDoubleClick}
                    />
                </div>

                <div className="m-canvas__download">
                    <div onClick={this.download}>Download Image</div>
                </div>
            </div>
        );
    }
}
