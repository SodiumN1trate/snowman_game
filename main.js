
const app = new PIXI.Application({
    width: 1000,
    height: 600,
    antialias: true
})
document.body.appendChild(app.view)

const backgroundTexture = PIXI.Texture.from('background.jpg')
const background = new PIXI.TilingSprite(
	backgroundTexture,
	app.screen.width,
	app.screen.height
);

app.stage.addChild(background)

const snowmanTexture = PIXI.Texture.from('snowman.svg')
const snowman = new PIXI.Sprite(snowmanTexture)
snowman.y = 400
snowman.x = -400

app.stage.addChild(snowman)

const fps = new PIXI.Text('Nope')
app.stage.addChild(fps)

const ballTexture = PIXI.Texture.from('basketball.svg')
const ball = new PIXI.Sprite(ballTexture)
console.log(ball)
let ballStartCoordinateY = 400
let ballStartCoordinateX = -350
ball.y = ballStartCoordinateY
ball.x = ballStartCoordinateX
ball.width = 50
ball.height = 50

app.stage.addChild(ball)


let ballSpeedY = 0
let ballSpeedX = 0

let lastTime = 0

let isGrounded = false

let throwed = 0

app.stage.pivot.x = -350 - app.view.width / 2
background.x = -350 - app.view.width / 2

function throw_ball(ball) {
    let angle = document.getElementById("angle").value * Math.PI / 180
    let force = document.getElementById("force").value
        
    let forceX = Math.cos(angle) * force
    let forceY = Math.sin(angle) * force

    let stopAcceleration = forceX / 0.5

    // pag
    ballSpeedX = forceX
    ballSpeedY = -forceY

    app.ticker.add((delta) => {
        fps.text = `FPS: ${Math.ceil(app.ticker.FPS)}`
        ballSpeedY += 0.5 ? ballSpeedY != 0 && ball.y + ball.height/2 < app.view.height : 0
        if(ball.y + ball.height/2 > app.view.height) {
            if(Math.sqrt(ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY) >= (force/10)*6) {
                let returnForce = Math.sqrt(ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY)
                angle -= angle/10
                ballSpeedX = Math.cos(angle) * returnForce
                ballSpeedY = -Math.sin(angle) * returnForce
                ballSpeedY -= ballSpeedY / 10
                ballSpeedX -= ballSpeedX / 10
            } else if (Math.sqrt(ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY) <= (force/10)*2) {
                ballSpeedY = 0
                if(ballSpeedX > 0) {
                    ballSpeedX -= stopAcceleration / app.ticker.FPS
                } else {
                    ballSpeedX = 0
                    app.stage.pivot.x = ball.x - app.view.width / 2
                    background.x = ball.x - app.view.width / 2
                    isGrounded = true
                    ball.y = ballStartCoordinateY
                    ball.x = ballStartCoordinateX
                    ballSpeedY = 0
                    ballSpeedX = 0
                    forceX = 0
                    forceY = 0
                    force = 0
                    angle = 0
                    lastTime = 0
                    app.stage.pivot.x = ball.x - app.view.width / 2
                    background.x = ball.x - app.view.width / 2
                }
            }
            else {
                ballSpeedY -= ballSpeedY / 10
                ballSpeedX -= ballSpeedX / 10
            }
        }
        
        if(isGrounded === false) {
            ball.y += ballSpeedY
            ball.x += ballSpeedX
            app.stage.pivot.x = ball.x - app.view.width / 2
            background.x = ball.x - app.view.width / 2
            // background.tilePosition.x -= Math.sqrt(ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY)
            fps.x = ball.x - app.view.width / 2
            const circle = new PIXI.Graphics()
            circle.beginFill(0xFFFFFF).drawCircle(ball.x+25, ball.y+25, 5).endFill()
            app.stage.addChild(circle)
            lastTime += delta
            console.log(ballSpeedX)
        }
    })
}



document.querySelector("#launch").addEventListener('click', () => {        
    isGrounded = false
    throw_ball(ball)

    delete ball

})
