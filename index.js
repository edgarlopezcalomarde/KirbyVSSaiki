
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: { 
        x: 0, 
        y:0
    },
    imageSrc: "./img/background.png"
})

const player = new Fighter({
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:10
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc: "./img/kirby/idle.png",
    framesMax: 5,
    scale: 3,
    offset:{
        x:-100,
        y:-50
    },
    sprites:{
        idle:{
            imageSrc: "./img/kirby/idle.png",
            framesMax: 5,
        },
        run:{
            imageSrc: "./img/kirby/run.png",
            framesMax: 5,
        },
        jump:{
            imageSrc: "./img/kirby/jump.png",
            framesMax: 1,
        }
    }
})

const enemy = new Fighter({
    position:{
        x:400,
        y:200       
    },
    velocity:{
        x:0,
        y:10
    },
    color:'blue',
    offset:{
        x:-50,
        y:0
    }
   

})


const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    }
}

decreaseTimer()

function animate () {
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    window.requestAnimationFrame(animate)

    background.update()

    player.update()
    // enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    //Default player img
    player.image = player.sprites.idle.image
    player.framesMax = player.sprites.idle.framesMax
    //Player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -4

    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.image = player.sprites.run.image
        player.velocity.x = 4
    }

    if(player.velocity.y < 0){
        player.image = player.sprites.jump.image
        player.framesMax = player.sprites.jump.framesMax
    }

    //Enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -4
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 4
    }

    //detect collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking
    ){
        player.isAttacking = false
        enemy.health-=20
        document.querySelector("#enemyHealth").style.width= enemy.health + '%'
    }

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking
    ){
        enemy.isAttacking = false
        player.health-=20
        document.querySelector("#playerHealth").style.width= player.health + '%'
    }

    //End game
    if(enemy.health <=0 || player.health <=0){
        determineWinner({player,enemy,timerId})
    }
}


animate()

window.addEventListener("keydown",(event)=>{
    
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break
        case 'w':
            player.velocity.y = -20
        break
        case ' ':
            player.attack()
        break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp':
            enemy.velocity.y = -20  
        break
        case 'Enter':
            enemy.attack()
        break
    }
})

window.addEventListener("keyup",(event)=>{

    switch(event.key){
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break

    }

    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp':
            enemy.velocity.y = -10  
        break
    }
})

