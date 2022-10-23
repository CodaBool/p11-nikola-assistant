import React, {useEffect} from 'react'

let circle
let line
let moveBy = 25;
let nIntervId;
let lIntervId;
let rIntervId;
export default function game02() {

    // movement - please calibrate these values
    var xSpeed = 0.0001;
    var ySpeed = 0.0001;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            cube.position.y += ySpeed;
        } else if (keyCode == 83) {
            cube.position.y -= ySpeed;
        } else if (keyCode == 65) {
            cube.position.x -= xSpeed;
        } else if (keyCode == 68) {
            cube.position.x += xSpeed;
        } else if (keyCode == 32) {
            cube.position.set(0, 0, 0);
        }
    };

    function moveup(){
        circle.style.top = parseInt(circle.style.top) - 1 + 'px'; 
        if (circle.style.top <='0px'){
            clearInterval(nIntervId);
            nIntervId = null;
        }
    }
    function moveleft(){
        circle.style.left = parseInt(circle.style.left) - 1 + 'px'; 
        if (circle.style.left <='0px'){
            clearInterval(lIntervId);
            lIntervId = null;
        }
    }
    function moveright(){
        circle.style.left = parseInt(circle.style.left) + 1 + 'px'; 
        if (circle.style.left >= "900px"){
            clearInterval(rIntervId);
            rIntervId = null;
        }
    }
    useEffect(() => {
        console.log('check for a window', typeof window)
        if (typeof window !== 'undefined') {
            console.log('found a window')
            circle = document.querySelector('.circle');
            line = document.querySelector('.line');
            window.addEventListener('load', () => {
                circle.style.position = 'relative';
                circle.style.left = '750px';
                circle.style.top = '750px';
            });
            window.addEventListener('load', () => {
                line.style.position = 'relative';
                line.style.left = '925px';
                line.style.top = '-30px';
            });
            window.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'ArrowLeft':
                        clearInterval(nIntervId);
                        nIntervId = null;
                        clearInterval(rIntervId);
                        rIntervId = null;
                        if (!lIntervId) {
                            lIntervId = setInterval(moveleft, 15);
                          }
                        break;
                    case 'ArrowRight':
                        clearInterval(nIntervId);
                        nIntervId = null;
                        clearInterval(lIntervId);
                        lIntervId = null;
                        if (!rIntervId ) {
                            rIntervId = setInterval(moveright, 15);
                          }
                        break;
                    case 'ArrowUp':
                        clearInterval(lIntervId);
                        lIntervId = null;
                        clearInterval(rIntervId);
                        rIntervId = null;
                        if (!nIntervId) {
                            nIntervId = setInterval(moveup, 15);
                          }
                        break;
                }
            });
        }
    }, [])
    return (
        <>
            <div className="circle"></div>
            <div className="line"></div>
            <div className="object"></div>
        </>
    )
}
