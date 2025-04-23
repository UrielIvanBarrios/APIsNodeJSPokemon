//Mi aplicacion de Pokemones
import express from 'express';
import { get } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { añadirPokemon, getPokemons, getPokemonsPorTipo, usarHabilidadAleatoria } from './service.js';

const app = express();
const PORT = process.env.PORT ?? 3002;
const HOST = process.env.HOST ?? "127.0.0.1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = path.join(__dirname, "../db/smartrotom.json")
//const url = path.join(__dirname, "../db/pizzas.list.json");

//Middlewares 
app.use(express.json());

app.use('/img', express.static(path.join(__dirname, "../img")));



app.get("/", (req, res) => {
    const imagePath = '/img/pokemon.webp';
    const responseText = `<img src="${imagePath}" alt="Logo Pokemon" style="max-width: 100vw; height: auto;">`;
    res.status(200).send(responseText);
    // res.json({ message: "Mensaje desde App Pokemon" });

});

app.get("/obtenerPokemones",async (req,res) => {
    const pokemones = await getPokemons(url);
    res.json(pokemones);
});

app.post("/agregarPokemon", async(req, res) => {
    const {nombre, tipo, habilidades, torneos} = req.body;
    const pokemon = {nombre, tipo, habilidades, torneos};
    const pokemonAñadido = await añadirPokemon(url, pokemon);
    if (pokemonAñadido) {
        res.status(201).json({message: "Pokemon añadido correctamente"});
    } else {
        res.status(400).json({message: "Ya existe un pokemon con ese nombre"});
    }
});

app.get("/obtenerPokemonesPorTipo/:tipo", async (req,res) => {
    try{
        const tipoPokemon = req.params.tipo;
        const pokemonesFiltrados = await getPokemonsPorTipo(url, tipoPokemon);
        if (pokemonesFiltrados.length > 0) {
            res.status(200).json(pokemonesFiltrados);
        }else{
            res.status(404).json({message: "No se encontraron pokemones de ese tipo"});
        }
    }catch(error){
        console.error("Error al obtener el pokemon del tipo: ",error);
        res.status(500).json({message: "Error interno del servidor"});
    }
});

app.get("/usarPokemon/:nombre",async(req,res) => {
    const nombrePokemon = req.params.nombre;
    try{
        const habilidadAleatoria = await usarHabilidadAleatoria(url,nombrePokemon);
        const responseText = habilidadAleatoria ? `<h1>El pokemon ${nombrePokemon} ha usado la habilidad: ${habilidadAleatoria}.</h1>` : `<h1>El pokemon ${nombrePokemon} intento usar una habilidad, ¡Pero fallo!</h1>`;
        res.status(200).send(responseText);
    }catch(error){
        console.error("Error al usar habilidad del pokemon: ",error);
        res.status(404).json({message:"Pokemon no encontrado"});
    }
})


app.listen(PORT, () => console.log(`Poke App is listening on http://${HOST}:${PORT}`));