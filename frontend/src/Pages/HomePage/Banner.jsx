import React, { useEffect } from 'react';

const Banner = () => {
    useEffect(() => {
        const canvas = document.querySelector("#root > .home-banner canvas");   
        const ctx = canvas.getContext("2d");

        let width = canvas.parentElement.getBoundingClientRect().width;
        let height = width / 3 * 2.5;
        canvas.width = width; canvas.height = height;
        let iw = window.innerWidth >= 980 ? 980 : window.innerWidth;

        const logos = new Array(7).fill();
        let r = iw / 8;
        let ax = 0, ay = 0;
        let w = r / 2, h = r / 3;
        const texture = new Image();
        texture.src = '/media/logo.svg';
        const thumbsup = new Image();
        thumbsup.src = '/media/thumbsup.svg';
        let thumbsupScale = 1;

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 980) iw = 980;
            else iw = window.innerWidth;

            width = canvas.parentElement.getBoundingClientRect().width;
            height = width / 3 * 2;
            canvas.width = width; canvas.height = height;

            r = iw / 8;
            w = r / 2; h = r / 3;
        });

        const init = () => {
            logos.forEach((_, i) => {
                logos[i] = {
                    x: r * Math.cos(((360 / 7 * i) * Math.PI / 180)),
                    y: r * Math.sin(((360 / 7 * i) * Math.PI / 180))
                };
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            thumbsupScale = 0.8 * Math.sin(ay * 8) + 1.5;

            ctx.strokeStyle = "#2b3d52";
            ctx.lineWidth = r / 15;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.drawImage(thumbsup, width / 2 - (w * thumbsupScale / 2), height / 2 - (w * thumbsupScale / 2), w * thumbsupScale, w * thumbsupScale);

            logos.forEach((logo, i) => {
                logos[i].x = (r * Math.cos(((360 / 7 * i) * Math.PI / 180) + ax) + width / 2);
                logos[i].y = (r * Math.sin(((360 / 7 * i) * Math.PI / 180) + ay) + height / 2);

                ctx.drawImage(texture, logo.x - w / 2, logo.y - h / 2, w, h);
            });

            ax += 0.005; ay += 0.005;

            requestAnimationFrame(animate);
        }

        init();
        animate();
    }, []);

    return (
        <div className="home-banner">
            <div className="banner-content">
                <div className="left">
                    <h1>ShareFrame</h1>
                    <h4>Contribute, Support, and Share projects on ShareFrame</h4>
                </div>
                <div className="right">
                    <canvas></canvas>
                </div>
            </div>
        </div>
    );
}

export default Banner;