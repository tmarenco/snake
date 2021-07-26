// A cada tecla que puede ser utilizada en el juego le damos un valor para luego representar su movimiento
const DIRECCION = {
    ArrowDown: [0, 1],
    ArrowUp: [0, -1],
    ArrowRight: [1, 0],
    ArrowLeft: [-1, 0],
    S: [0, 1],
    W: [0, -1],
    D: [1, 0],
    A: [-1, 0],
    s: [0, 1],
    w: [0, -1],
    d: [1, 0],
    a: [-1, 0]
}

// La dirección representa el movimiento que hará la serpiente. Inicialmente se mueve para la derecha cuando el juego comienza.
// El bicho es un array en el que en cada posición almacenaremos la posición de una parte del cuerpo de la serpiente que se irá incrementando a medida que se alimente.
// También tenemos la victima, que será lo que la serpiente come para crecer.
// Jugando será un valor que pondremos en true en cuanto el juego esté corriendo.
// Crecimiento va a ser modificado a medida que crezca.
let controles = {
    direccion: {x:1, y:0}, 
    bicho:[{x:0, y: 0}], 
    victima:{x: 0, y:0},
    jugando: false,
    crecimiento: 0,
    score: 0
}
// Creamos la variable "movimiento" a la cual luego le modificaremos le daremos valor luego.
let movimiento 

// Seleccionamos la etiqueta canvas
let papel = document.querySelector("canvas");
// Le damos un contexto que almacenamos en la variable
let ctx = papel.getContext("2d");

// Creamos una función llamada "looper" que se repetirá cada 80 milisegundos utilizando setTimeout
let looper = ()=>{
    let cola = {}
    // Object.assign le asgina al primer parámetro los valores del segundo. En este caso le asignamos a cola (un objeto vacío), la ultima posición del array bicho.
    Object.assign(cola, controles.bicho[controles.bicho.length - 1])
    //A esta variable le asignamos la posición inicial del bicho.
    const miembro = controles.bicho[0]
    // Si la cabeza choca contra la víctima, en atrapado se guarda un "true"
    let atrapado = miembro.x === controles.victima.x && miembro.y === controles.victima.y
    // Si la función detectarChoque da true, entonces hacemos que controles.jugando sea false.
    if (detectarChoque()){
        controles.jugando = false
        let finDelJuego = document.querySelector(".finDelJuego")
        let puntuacion = document.querySelector(".puntuacion")
        let reiniciarJuego = document.querySelector(".reiniciarJuego")
        puntuacion.innerHTML = "Tu puntaje fue: " + controles.score
        finDelJuego.style.display = "block"
        puntaje.style.display = "none"
        reiniciarJuego.addEventListener("click", function(){
            finDelJuego.style.display = "none"
            puntaje.style.display = "block"
            reiniciar()
        })

    
    }
    // Creamos las variables "px" y "py" en donde almacenamos el valor tanto de x como de y que representa la posición del movimiento de la serpiente.
    let px = controles.direccion.x
    let py = controles.direccion.y
    // Creamos la variable tamaño que contiene la longitud del array bicho.
    let tamaño = controles.bicho.length - 1

    // Solo procedemos a seguir si controles.jugando es true.
    if (controles.jugando){
        // Creamos un for para iterar sobre este array.
        for (let idx = tamaño; idx > -1; idx--){
            // Creamos la variable "miembro" a la cual le asignamos el valor de la posición de la última posición del array bicho.
            const miembro = controles.bicho[idx]
            // Si idx (tamaño) es igual a 0, quiere decir que estamos iterando sobre la cabeza, por lo cual se le suma a la posición de x e y de miembro (bicho) el valor que haya en px y py.
            if (idx == 0){
                miembro.x += px
                miembro.y += py
                // Si no estamos iterando sobre la cabeza, es decir que estamos iterando sobre alguna posición de la cola. 
                // En este caso hacemos que a esa posición de la cola se le de el lugar de la última posición en x e y de la anterior posición del item del bicho.
            } else {
                miembro.x = controles.bicho[idx - 1].x
                miembro.y= controles.bicho[idx - 1].y
            }
        }
    }
    // Si atrapado es igual a true, llamamos a la función revictima y le sumamos uno a controles.crecimiento.
    if (atrapado){
        controles.score += 50
        controles.crecimiento += 5
        puntaje.innerHTML = "PUNTAJE:" + controles.score
        revictima()
    }
    // Le asignamos al bicho lo que almacenamos en cola.
    if (controles.crecimiento > 0){
        controles.bicho.push(cola)
        controles.crecimiento -= 1;
    }
    // Generamos la animación utilizando la función dibujar
    requestAnimationFrame(dibujar)
    setTimeout(looper, 80)
}

//Con esta función verificamos si la cabeza de nuestra serpiente chocó contra alguno de los bordes o contra si mismo. Si lo hace, retornamos true.
let detectarChoque = () => {
    const head = controles.bicho[0]
    if (head.x < 0 || head.x >= 500/10 || head.y >= 500/10 || head.y < 0){
        return true
    }
    for (let idx = 1; idx<controles.bicho.length; idx++){
        const sq = controles.bicho[idx]
        if (sq.x === head.x && sq.y === head.y){
            return true
        }
    }
}
document.onkeydown = (e) => {
    // A la variable movimiento le almacenamos el valor de cada tecla que podrá ser apretada.
    movimiento = DIRECCION[e.key]
    // Creamos una nueva variable para x e y en la cual quedará almacenado el valor correspondiente a la tecla que se haya tocado.
    const [x, y] = movimiento
    // Este condicional lo hacemos para que no pueda pisarse la serpiente. Si está yendo para arriba, no puede ir para abajo sin moverse para un costado primero. Lo mismo en los costados.
    if (-x !== controles.direccion.x && -y !== controles.direccion.y){
        controles.direccion.x = x
        controles.direccion.y = y
    }
}
// Creamos la función dibujar items que se encargará de darles un color y posicionarlos en donde corresponda.
let dibujarItems = (color, x, y) => {
    // Le asignamos un color a la serpiente
    ctx.fillStyle = color;
    // Le asignamos la posición del miembro, su alto y su ancho. Multiplicamos por 10 para que sea más rápido.
    ctx.fillRect(x * 10, y * 10, 10, 10);
}

let dibujar = ()=> {
    // Cada vez que se ejecute la función dibujar, queremos que se borre el contexto. 500 y 500 es el tamaño de canvas y 0 y 0 son las coordenadas. 
    // Esto hara que se borre el canvas cada vez que se ejecute. Una vez borrado, se deberá generar un nuevo rectángulo (speriente) en la posición que corresponda para generar el efecto de animación.
    ctx.clearRect(0,0,500,500)
    // Hago un for para instanciar los items de la serpiente y dibujar cada una.
    for (let idx = 0; idx<controles.bicho.length; idx++){
        const {x, y} = controles.bicho[idx];
        dibujarItems("green", x, y)
    }
    const victima = controles.victima
    // Llamo a la función dibujar y le paso los parámetros que necesita para crear a la víctima.
    dibujarItems("white", victima.x, victima.y)
}

// Función que retorna posiciones random tanto en x como en y. 
//Tenemos que dividirlo por 10 porque arriba lo multiplicamos para dar más velocidad. Si no lo dividimos se va de la pantalla.
// También creamos una dirección random para que no siempre empiece para el mismo lado. Trasnformamos el objeto DIRECCION a un array.
let lugarRandom = ()=>{
    let direccion = Object.values(DIRECCION)
    return {
        x: parseInt(Math.random()*500 / 10),
        y: parseInt(Math.random()*500 / 10),
        d: direccion[parseInt(Math.random()*11)]
    }
}
// Función que le da a la víctima una nueva posición
let revictima = ()=>{
    let nuevaPosicion = lugarRandom()
    let victima = controles.victima;
    victima.x = nuevaPosicion.x;
    victima.y = nuevaPosicion.y;
}
// Creamos la funión reiniciar para iniciar el juego nuevamente.
let reiniciar = ()=> {
    // Llamamos a controles nuevamente para que cuando se ejecute reiniciar los valores sean los mismos que los del principio
    controles = {
        direccion: {x:1, y:0}, 
        bicho:[{x:0, y: 0}], 
        victima:{x: 0, y:0},
        jugando: false,
        crecimiento: 0,
        score: 0
    }
    puntaje.innerHTML = "PUNTAJE:" + controles.score
    // Posición random de la serpiente
    posiciones = lugarRandom();
    let cabeza = controles.bicho[0];
    cabeza.x = posiciones.x;
    cabeza.y = posiciones.y;
    controles.direccion.x = posiciones.d[0]
    controles.direccion.y = posiciones.d[1]
    // Implementamos condicionales para que la cabeza no pueda aparecer muy cerca de los bordes así no se pierde facilmente
    // if (cabeza.y < 20){
    //     controles.direccion.x == 0 && controles.direccion.y == 1
    // } else if (cabeza.y > 30){
    //     controles.direccion.x == 0 && controles.direccion.y == -1
    // } else if (cabeza.x < 20){
    //     controles.direccion.x == 1 && controles.direccion.y == 0
    // } else if (cabeza.x > 30){
    //     controles.direccion.x == -1 && controles.direccion.y == 0
    // }
    // else {
    //     controles.direccion.x = posiciones.d[0]
    //     controles.direccion.y = posiciones.d[1]
    // }
    // Posición random de la victima
    posicionVictima = lugarRandom();
    let victima = controles.victima;
    victima.x = posicionVictima.x;
    victima.y = posicionVictima.y;
    controles.jugando = true
}
// Cada vez que cargue la ventana haremos que la función looper se ejecute junto con reiniciar
window.onload = () => {
    reiniciar()
}


// Funcionalidad del botón iniciar
let iniciarJuego = document.querySelector(".iniciarJuego")
let iniciar = document.querySelector(".iniciar")
let puntaje = document.querySelector(".puntaje")
iniciar.addEventListener("click", function(){
    iniciarJuego.style.display = "none";
    puntaje.style.display = "block";
    puntaje.innerHTML = "PUNTAJE:" + controles.score
    looper()

})
// TAREA: 
//1) SI EL PUNTITO SE GENERA MUY CERCA DEL 0, LA DIRECCION NO PUEDE SER PARA ARRIBA PORQUE VA A PEDER. IF EL PUNTITO ES MENOR A TANTO, NO PUEDE IR PARA ARRIBA.
//6) A medida que la serpiente crezca, que vaya más rápido y que crezca más rápido.
//7) Poner botones flotates para que cuando uno lo abra desde el celular pueda jugar tocando esos botones.
//8) Que la pantalla de canvas se cambie dependiendo de en que pantalla se abra.
