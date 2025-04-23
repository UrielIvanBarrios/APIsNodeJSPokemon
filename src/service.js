import {readFile, writeFile} from 'fs/promises';

const cleanPokemonsList = (pokemons) => pokemons.map(pokemon => ({pokemonName: pokemon.nombre, pokemonType: pokemon.tipo}))

const llamarSmartrotom = async(path) => {
    const pokemones = await readFile(path, {encoding : "utf8"})
    const pokemonesJson = JSON.parse(pokemones);
    return pokemonesJson;
}

const getPokemons = async(path) => {
    const pokemonsJson = await llamarSmartrotom(path);
    const listaPokemons = cleanPokemonsList(pokemonsJson);
    return listaPokemons;

}

const getPokemonsPorTipo = async(path,tipo) => {
    const pokemonsJson = await llamarSmartrotom(path);
    const listaPokemons = pokemonsJson.filter(pokemon => pokemon.tipo.some(t => t.toLowerCase() === tipo.toLowerCase()))
    return cleanPokemonsList(listaPokemons);
}

const esPokemonValido = (pokemon) => {
    return pokemon?.nombre &&                     // Nombre es obligatorio (string no vacío)
           Array.isArray(pokemon?.tipo) &&        // Tipo debe ser array (puede estar vacío)
           Array.isArray(pokemon?.habilidades) && // Habilidades debe ser array (puede estar vacío)
           (pokemon?.torneos === undefined ||     // Torneos es opcional
            Array.isArray(pokemon.torneos));      // Si existe, debe ser array
};

const validarExistePokemon = async(pokemones, pokemon) => {
    const nombrePokemon = pokemon.nombre.toLowerCase()
    return pokemones.some(p => p.nombre.toLowerCase() === nombrePokemon)
}

const añadirPokemon = async(path, pokemon) => {
    const pokemones = await llamarSmartrotom(path);
    const pokemonExiste = await validarExistePokemon(pokemones, pokemon)
    const seAnadio = false;
    if (!pokemonExiste && esPokemonValido(pokemon)) {
        pokemones.push(pokemon)
        const pokemonesString = JSON.stringify(pokemones, null, 2);
        await writeFile(path, pokemonesString, {encoding: "utf8"});
        seAnadio = true;
    }
    return seAnadio;
}

const usarHabilidadAleatoria = async(path,nombrePokemon) => {
    const pokemones = await llamarSmartrotom(path);
    const pokemon = pokemones.find(p => p.nombre.toLowerCase() === nombrePokemon.toLowerCase())
    if (pokemon) {
        const {habilidades} = pokemon;
        const habilidadAleatoria = habilidades[Math.floor(Math.random() * habilidades.length)];
        return habilidadAleatoria;
    }else{
        throw new Error("Pokemon no encontrado");
    }
}

export {getPokemons, añadirPokemon, getPokemonsPorTipo, usarHabilidadAleatoria};