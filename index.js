
const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: { 
        x:0, 
        y:0
    },
    imageSrc: "./img/background.png"
})

const player = new Fighter({
    position:{
        x:40,
        y:0
    },
    velocity:{
        x:0,
        y:10
    },
    imageSrc: "./img/kirby/idle.png",
    framesMax: 5,
    scale: 3,
    offset:{
        x:0,
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
        },
        fall:{
            imageSrc: "./img/kirby/fall.png",
            framesMax: 4,
        },
        attack1:{
            imageSrc: "./img/kirby/attack1.png",
            framesMax: 7,
        },
        takehit:{
            imageSrc: "./img/kirby/takehit.png",
            framesMax: 2,
        },
        death:{
            imageSrc: "./img/kirby/dead.png",
            framesMax: 1,
        }
    },
    attackBox:{
        offset:{
            x:40,
            y:0
        },
        width:90,
        height:90
    }
})

const enemy = new Fighter({
    position:{
        x:840,
        y:200       
    },
    velocity:{
        x:0,
        y:10
    },
    color:'blue',
    imageSrc: "./img/saiki/idle.png",
    framesMax: 4,
    scale: 3,
    offset:{
        x:0,
        y:40
    },
    sprites:{
        idle:{
            imageSrc: "./img/saiki/idle.png",
            framesMax: 4,
        },
        run:{
            imageSrc: "./img/saiki/run.png",
            framesMax: 6,
        },
        jump:{
            imageSrc: "./img/saiki/jump.png",
            framesMax: 1,
        },
        fall:{
            imageSrc: "./img/saiki/fall.png",
            framesMax: 1,
        },
        attack1:{
            imageSrc: "./img/saiki/attack1.png",
            framesMax: 5,
        },
        takehit:{
            imageSrc: "./img/saiki/takehit.png",
            framesMax: 2,
        },
        death:{
            imageSrc: "./img/saiki/dead.png",
            framesMax: 5,
        }
    },
    attackBox:{
        offset:{
            x:0,
            y:0
        },
        width:90,
        height:90
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
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


   
    //Player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -8
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 8
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    //jumping
    if(player.velocity.y < 0){
      player.switchSprite('jump')
    }else if(player.velocity.y > 0){
      player.switchSprite('fall')

    }

    //Enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -8
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 8
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    //jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')

    }


    //detect collision & enemy gets hit
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking  && player.framesCurrent === 5
    ){
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector("#enemyHealth").style.width= enemy.health + '%'
    }

    //IF player misses

    if(player.isAttacking && player.framesCurrent === 6){
        player.isAttacking ==false 
    }


    //player gets hit

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking && player.framesCurrent === 4
    ){
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector("#playerHealth").style.width= player.health + '%'
    }


    //IF enemy misses

    if(enemy.isAttacking && enemy.framesCurrent === 4){
        player.isAttacking ==false 
    }


    //End game
    if(enemy.health <=0 || player.health <=0){
        determineWinner({player,enemy,timerId})
    }
}


animate()

window.addEventListener("keydown",(event)=>{
    if(!player.dead){
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
         
        }
    }
   
    if(!enemy.dead){
        switch(event.key){
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

