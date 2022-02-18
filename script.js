const canvas = document.querySelector('canvas')
const c = canvas.getContext("2d")

canvas.width=1024
canvas.height=596

const gravity=1

// Function for creating a image

function createImage(imgSrc){
    var img = new Image()
    img.src=imgSrc
    return img
}

let platf = createImage("./images/platform7.png")
let b1 = createImage("./images/bg2.jpg")


class Player{
    constructor(){

        this.speed = 8
        this.position={
            x:100,
            y:100
        }
        this.velocity={
            x:0,
            y:0
        }
        // this.width=playerStandR.width
        this.width = 66
        // this.height=playerStandR.height
        this.height = 150

        this.frames = 0
        this.spriteSet = {
            stand : {
                right: createImage("./images/spriteStandR.png"),
                left : createImage("./images/spriteStandL.png"),
                cropWidth : 177,
                width: 66
            },

            run : {
                right : createImage("./images/spriteRunR.png"),
                left : createImage("./images/spriteRunL.png"),
                cropWidth : 340,
                width: 127.75
            }
        }

        this.sprite = this.spriteSet.stand.right
        this.currentCrop = 177

    }
    draw(){
        c.drawImage(
            this.sprite,
            this.currentCrop*this.frames,0,this.currentCrop ,400,
            this.position.x,
            this.position.y,
            this.width, 
            this.height
            )
    }

    update(){
        this.frames++

        if (this.frames>28){
            this.frames = 0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x

        if (this.position.y+this.height+
            this.velocity.y<=canvas.height)
            {this.velocity.y+=gravity}
        
    }
}
class Platform{
    constructor(x,y){
        this.position={
            x,
            y
        }

        this.width=platf.width
        this.height=platf.height

    }

    draww(){
        // c.fillStyle="blue"
        // c.fillRect(this.position.x,this.position.y,
        //     this.width,this.height)

        c.drawImage(platf,this.position.x,this.position.y,this.width, this.height)
    }

}

class Background{
    constructor(x,y,w,h,imag){
        this.position={
            x,
            y
        }
        this.bgImage = imag
        this.width=w
        this.height=h
        this.imag = imag

    }

    drawBg(){
       
        c.drawImage(this.imag,this.position.x,this.position.y,this.width, this.height)
    }

}




// image variables 


let player=new Player()
// let platforms = [new Platform(-10,570), new Platform(430,570),new Platform(780,470),
//     new Platform(1120,350),new Platform(1520,470),new Platform(1850,345),new Platform(2150,450),
//     new Platform(2450,150),new Platform(2950,570),new Platform(3450,400)]

let platforms = [new Platform(-10,570), new Platform(430,570),new Platform(780,470)]

let newPlatform = new Platform(3950,300)

platforms.push(newPlatform)

let background = [
    new Background(0,0,1024,596,b1)
]

let keys ={
    right:{
        pressed:false
    },
    left:{
        pressed:false
    }
}

let travelled = 0
let travelForUpdate = 0
let first = 3500

function restart(){
// image variables 

 player = new Player()
//  platforms = [new Platform(-10,570,300,40), new Platform(430,570,300,40),new Platform(780,470,350,40),
//     new Platform(1120,350,350,40),new Platform(1520,470,350,40),new Platform(1850,345,350,40),
//     new Platform(2150,450,350,40),new Platform(2450,150,350),new Platform(2950,570,550,40),
//     new Platform(3450,400,350,40)]

platforms = [new Platform(-10,570,300,40), new Platform(430,570,300,40),new Platform(780,470,350,40)]

 background = [
    new Background(0,0,1024,596,b1)
]


 travelled=0
 travelForUpdate = 0

}

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle="white"
    c.fillRect(0,0,canvas.width,canvas.height)

    background.forEach(background => {background.drawBg()})

    player.update()
    platforms.forEach((platform => {
        platform.draww()
    }))

    if (keys.right.pressed && player.position.x<400){
        player.velocity.x=player.speed
    }
    else if ((keys.left.pressed && player.position.x>100) || 
    (keys.left.pressed && travelled === 0 && player.position.x >0)){
        player.velocity.x=-player.speed
    }
    else {
        player.velocity.x=0

        if (keys.right.pressed){
            platforms.forEach((platform => {
                platform.position.x-=player.speed
                
                
            }))
            travelForUpdate +=1
            travelled+=1
            
        }
        else if (keys.left.pressed && travelled > 0){
            platforms.forEach((platform => {
                platform.position.x+=player.speed
                travelled-=1
                
            }))
            travelForUpdate -= 1
            
        }

}

    // Collision detection
    platforms.forEach((platform) => {
    if (player.position.y + player.height <= platform.position.y && 
    player.position.y + player.velocity.y + player.height 
        >= platform.position.y  && player.position.x + 
            player.width >= platform.position.x &&
            player.position.x<=platform.position.x + 
                platform.width ){
        player.velocity.y=0
    }
})

let start = 600

if (travelForUpdate>=75){
    let wi = start + platf.width
    let he = (Math.random() * 100)*5.96
    if (he <100){
        he += 100
    }
    start = wi+300
    let newPlatform = new Platform(wi,he)
    platforms.push(newPlatform)
    console.log(travelForUpdate)
    console.log(travelled)
    travelForUpdate = 0
}


// Win condition 

if(travelled>=6250){
    console.log("win")
}


// Lose Condition 

if (player.position.y > canvas.height ){
    console.log("you lose")
    restart()
}
    }

animate()


addEventListener("keydown",({keyCode})=>{
    switch (keyCode){
        case 38:
            // console.log("up")
            player.velocity.y-=20
            
            break;
        case 37:
            // console.log("left")
            keys.left.pressed=true
            player.sprite = player.spriteSet.run.left
            player.currentCrop = player.spriteSet.run.cropWidth
            player.width = player.spriteSet.run.width
            break;
        case 40:
            // console.log("down")
            break;
        case 39:
            // console.log("right")
            keys.right.pressed=true
            player.sprite = player.spriteSet.run.right
            player.currentCrop = player.spriteSet.run.cropWidth
            player.width = player.spriteSet.run.width                                                                                                                                                                                                              
            break;
    }
})

addEventListener("keyup",({keyCode})=>{
    switch (keyCode){
        case 38:
            // console.log("up")
            break;
        case 37:
            // console.log("left")
            keys.left.pressed = false
            player.sprite = player.spriteSet.stand.left
            player.currentCrop = player.spriteSet.stand.cropWidth
            player.width = player.spriteSet.stand.width
            break;
        case 40:
            // console.log("down")
            // player.velocity.y=0
            break;
        case 39:
            // console.log("right")
            keys.right.pressed=false
            player.sprite = player.spriteSet.stand.right
            player.currentCrop = player.spriteSet.stand.cropWidth
            player.width = player.spriteSet.stand.width
            break;
    }
})
