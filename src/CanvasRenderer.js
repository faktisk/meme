import classnames from 'classnames';

export default class CanvasRenderer extends React.Component {
    node = React.createRef();
    state = { drag: false };

    componentDidUpdate() {
        this.draw();
    }

    componentDidMount() {
        this.draw();
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
            var x = padding;
            var y = padding;

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

            var words = headlineText.split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += Math.round(fontSize * 1.5);
                } else {
                    line = testLine;
                }
            }

            ctx.fillText(line, x, y);
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
        canvas.style.cursor = background.width ? 'grab' : 'default';
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

    hasBackground = () => {
        const { width, height } = this.props.background;
        return width && height;
    };

    handleMouseDown = event => {
        if (this.hasBackground()) {
            const {
                background,
                imageScale,
                backgroundPosition,
                width,
                height,
            } = this.props;

            const imageWidth = (background.width * imageScale) / 2;
            const imageHeight = (background.height * imageScale) / 2;
            const origin = { x: event.clientX, y: event.clientY };

            const start = {
                x: backgroundPosition.x || width / 2,
                y: backgroundPosition.y || height / 2,
            };

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
        if (this.hasBackground()) {
            this.setState({ drag: null });
        }
    };

    handleMouseOut = () => {
        if (this.hasBackground()) {
            this.setState({ drag: null });
        }
    };

    handleMouseMove = evt => {
        if (this.state.drag) {
            evt.preventDefault();

            const { width, height } = this.props;

            const {
                drag: { imageWidth, imageHeight, start, origin },
            } = this.state;

            this.props.onBackgroundPosition({
                x: Math.max(
                    width - imageWidth,
                    Math.min(start.x - (origin.x - evt.clientX), imageWidth)
                ),
                y: Math.max(
                    height - imageHeight,
                    Math.min(start.y - (origin.y - evt.clientY), imageHeight)
                ),
            });
        }
    };

    handleDoubleClick = evt => {
        this.props.onBackgroundPosition({ x: 0, y: 0 });
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
                        onMouseOut={this.handleMouseOut}
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
