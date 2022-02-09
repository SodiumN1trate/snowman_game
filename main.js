
const app = new PIXI.Application({
    width: 1000,
    height: 600,
    antialias: true
})
app.view.style.marginLeft = 'auto'
app.view.style.marginRight = 'auto'

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

const fps = new PIXI.Text('')
app.stage.addChild(fps)

const speedText = new PIXI.Text('')
app.stage.addChild(speedText)

const lastScore = new PIXI.Text('')
app.stage.addChild(lastScore)


let throws = 3

const attemptsText = new PIXI.Text(`Attempts: ${throws}`)
attemptsText.x = app.view.width - 1000
app.stage.addChild(attemptsText)

const ballTexture = PIXI.Texture.from('basketball.svg')
const ball = new PIXI.Sprite(ballTexture)
let ballStartCoordinateY = 400
let ballStartCoordinateX = -350
ball.y = ballStartCoordinateY
ball.x = ballStartCoordinateX
ball.width = 50
ball.height = 50

app.stage.addChild(ball)

let lastTime = 0


const colors = [0xFFFFFF, 0x52bf90F, 0xFFED00F]

const leaderboard = [0, 0, 0]

app.stage.pivot.x = -350 - app.view.width / 2
background.x = -350 - app.view.width / 2

function throw_ball(ball) 
{
    let isGrounded = false
    ball.y = ballStartCoordinateY
    ball.x = ballStartCoordinateX

    let forceX = 0
    let forceY = 0

    app.stage.pivot.x = ball.x - app.view.width / 2
    background.x = ball.x - app.view.width / 2

    let ballSpeedY = 0
    let ballSpeedX = 0

    app.stage.pivot.x = ball.x - app.view.width / 2
    background.x = ball.x - app.view.width / 2

    let angle = document.getElementById("angle").value * Math.PI / 180
    let force = document.getElementById("force").value

    forceX = Math.cos(angle) * force
    forceY = Math.sin(angle) * force

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
                    isGrounded = true
                    leaderboard[throws] = ball.x
                    lastScore.text = `Last score: ${Math.ceil(leaderboard[throws] / 100)}m`
                    document.querySelector("#launch").disabled = false
                    document.querySelector("#launch").style.backgroundColor = '#127FBE'
                    if(throws === 0) {
                        const winnerText = new PIXI.Text(`Highscore: ${String(Math.ceil(Math.max.apply(null, leaderboard)/100))} meters`)
                        app.stage.addChild(winnerText)
                        winnerText.y =  app.view.height / 2
                        winnerText.x = app.view.width / 2 - 990
                        delete ball
                    }
                        app.stage.pivot.x = app.view.width - 1870
                        background.x = app.view.width - 1870
                        lastScore.x = app.view.width / 2 - 990
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
            fps.x = ball.x - app.view.width / 2
            attemptsText.x =  (ball.x - app.view.width / 2) + 850
            lastScore.x = (ball.x - app.view.width / 2) + 380
            const circle = new PIXI.Graphics()
            circle.beginFill(colors[throws]).drawCircle(ball.x+25, ball.y+25, 5).endFill()
            app.stage.addChild(circle)

            speedText.text = `${Math.ceil(ball.x/100)}m`
            speedText.x = ball.x + 50
            speedText.y = ball.y - 50
        }
    })
}



document.querySelector("#launch").addEventListener('click', () => {
    throws -= 1
    attemptsText.text = `Attempts: ${throws}`
    document.querySelector("#launch").disabled = true
    document.querySelector("#launch").style.backgroundColor = 'gray'
    if(throws >= 0) {
        if(throws === 0){
            document.querySelector("#launch").innerHTML = "Reset"
        }
        throw_ball(ball)
    }
    if(throws < 0){
        window.location.reload();
    }
})
