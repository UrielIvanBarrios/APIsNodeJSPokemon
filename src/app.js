//Mi aplicacion de Pokemones
import express from 'express';
import { get } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { añadirPokemon, getPokemons } from './service.js';

const app = express();
const PORT = process.env.PORT ?? 3002;
const HOST = process.env.HOST ?? "127.0.0.1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = path.join(__dirname, "../db/smartrotom.json")
//const url = path.join(__dirname, "../db/pizzas.list.json");

//Middlewares 
app.use(express.json());



app.get("/", (req, res) => {
    const responseText = `<h1>Soy un Pokemon!!</h1>`;
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


app.listen(PORT, () => console.log(`Poke App is listening on http://${HOST}:${PORT}`));