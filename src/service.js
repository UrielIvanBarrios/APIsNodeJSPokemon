import {readFile, writeFile} from 'fs/promises';

const cleanPokemonsList = (pokemons) => pokemons.map(pokemon => ({pokemonName: pokemon.nombre, pokemonType: pokemon.tipo}))

const getPokemons = async(path) => {
    const pokemons = await readFile(path, {encoding : "utf8"})
    const pokemonsJson = JSON.parse(pokemons);
    const listaPokemons = cleanPokemonsList(pokemonsJson);
    return listaPokemons;

}

const getPokemonsPorTipo = async(path,tipo) => {
    const pokemons = await readFile(path, {encoding : "utf8"});
    const pokemonsJson = JSON.parse(pokemons);
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
    const pokemonesJson = await readFile(path, {encoding : "utf8"})
    const pokemones = JSON.parse(pokemonesJson)
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

export {getPokemons, añadirPokemon, getPokemonsPorTipo};