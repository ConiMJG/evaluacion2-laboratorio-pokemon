document.addEventListener("DOMContentLoaded", () => {
    const iniciarBtn = document.getElementById("iniciar-btn");
    const continuarBtn = document.getElementById("continuar-btn");

    const bienvenida = document.getElementById("bienvenida");
    const seccionNombre = document.getElementById("nombre-entrenador");
    const selectorRegion = document.getElementById("selector-region");
    const seleccion = document.getElementById("seleccion-pokemon");
    
    const inputNombre = document.getElementById("inputNombre");
    const mensajeBurbuja = document.getElementById("mensaje-entrenador");
    const nombreEntrenador = document.getElementById("nombre-entrenador-mostrar");
    const nombrePokemon = document.getElementById("pokemon-elegido");

    const contenedorPokemon = document.querySelector(".pokemon-container");
    const registroElecciones = document.getElementById("registro-elecciones");
    const mensajeEleccion = document.getElementById("mensaje-eleccion");
    const listaElecciones = document.getElementById("lista-elecciones");
    const regionCards = document.querySelectorAll(".region-card");

    const reiniciarBtn = document.getElementById("reiniciar-btn");
    const botonesVolver = document.querySelectorAll(".btn-volver");

    const pokemonPorRegion = {
        kanto: ["bulbasaur", "charmander", "squirtle", "pikachu"],
        johto: ["chikorita", "cyndaquil", "totodile", "pichu"],
        hoenn: ["treecko", "torchic", "mudkip", "ralts"]
    };

    iniciarBtn.addEventListener("click", () => {
        bienvenida.style.display = "none";
        seccionNombre.style.display = "block";
    });

    continuarBtn.addEventListener("click", () => {
        const nombreIngresado = inputNombre.value.trim();

        if (nombreIngresado === "") {
            alert("Por favor, ingresa tu nombre de entrenador.");
            return;
        }

        mensajeBurbuja.innerHTML = `<strong> ¡Buena suerte, ${nombreIngresado}! </strong><br>Tu aventura está a punto de comenzar.`;

        seccionNombre.style.display = "none";
        selectorRegion.style.display = "block";
        selectorRegion.scrollIntoView({ behavior: "smooth" });
    });

    regionCards.forEach(card => {
        card.addEventListener("click", () => {
            const region = card.dataset.region;
            selectorRegion.style.display = "none";
            cargarPokemones(region);
        });
    });        

    function cargarPokemones(region) {
        selectorRegion.style.display = "none";
        seleccion.style.display = "block";
    
        const pokemons = pokemonPorRegion[region];
        contenedorPokemon.innerHTML = ""; 

        pokemons.forEach(async (nombrePokemon) => {
            try{
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
                const data = await res.json();

                const tipos = data.types.map(t => t.type.name).join(",");
                const numero = data.id;
                const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);

                const card = document.createElement("div");
                card.classList.add("pokemon-card");
                card.innerHTML = `
                    <img src="${data.sprites.front_default}" alt="${nombre}">
                    <h3>#${numero} ${nombre}</h3>
                    <p>Tipo: ${tipos}</p>
                    <button class="elegir-btn">Elegir</button>
                `;
                const btnElegir = card.querySelector(".elegir-btn");
                btnElegir.addEventListener("click", () => {
                    const nombreEntrenadorValor = inputNombre.value.trim();

                    if (nombreEntrenadorValor === "") {
                        alert("Por favor, ingresa tu nombre antes de elegir.");
                        return;
                    }

                    nombreEntrenador.textContent = nombreEntrenadorValor;
                    nombrePokemon.textContent = `${nombre}`;
                    registroElecciones.style.display ="block";

                    mensajeEleccion.innerHTML = `
                        <p><i class="fas fa-star"></i>¡${nombreEntrenadorValor} ha elegido a <strong>${nombre}</strong> como su compañero inicial!</p>
                    `;

                    const li = document.createElement("li");
                    li.textContent = `Entrenador: ${nombreEntrenadorValor} - Pokémon: #${numero} ${nombre}`;
                    listaElecciones.appendChild(li);

                    btnElegir.disabled = true;
                    btnElegir.textContent = "Elegido";
                });
                contenedorPokemon.appendChild(card);
            } catch (error){
                console.error("Error al obtener Pokémon:", nombrePokemon, error);
            }
        })
    };

    reiniciarBtn.addEventListener("click", () => {
    listaElecciones.innerHTML ="";

    const botonesElegir = document.querySelectorAll(".elegir-btn");
    botonesElegir.forEach(boton => {
        boton.disabled = false;
        boton.textContent = "Elegir";
    });
    mensajeEleccion.style.display = "none";
    nombreEntrenador.textContent = "";
    nombrePokemon.textContent = "";

    registroElecciones.scrollIntoView({ behavior: "smooth" });
    });

    botonesVolver.forEach(boton => {
        boton.addEventListener("click", () => {
            const seccionActual = boton.parentElement;
            const idSeccionAnterior = boton.dataset.volver;
            const seccionAnterior = document.getElementById(idSeccionAnterior);

            seccionActual.style.display = "none";
            seccionAnterior.style.display = "block";
            seccionAnterior.scrollIntoView({ behavior: "smooth" });
        });
    });
});