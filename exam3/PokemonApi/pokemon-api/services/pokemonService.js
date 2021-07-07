const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);

db.defaults({ pokemons: [] }).write();

exports.get = (name) => {

    console.log(name);

    if (!name) {
        const pokemons = db.get('pokemons').value();
        return pokemons;
    }
    
    const pokemon =
        db.get('pokemons')
            .value()
            .filter((_) => _.name === name);

    console.log(pokemon);

    if (pokemon.length > 0)
        return pokemon;

    //else return error
};

exports.insert = (pokemon) => {
    const { name } = pokemon;

    const isPokemonExist =
        db
            .get('pokemons')
            .value()
            .filter((_) => _.name === name).length > 0;

    if (isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} already exist.`,
        };
    }

    db.get('pokemons').push(pokemon).write();

    return {
        success: true,
    };
};

exports.update = (pokemon) => {
    const { name } = pokemon;

    const pokemonNotFound = {
        success: false,
        errorMessage: `Pokemon do not exist.`,
    };

    if (!name)
        return pokemonNotFound;

    const pokemonExists =
        db
            .get('pokemons')
            .value()
            .filter((_) => _.name === name).length > 0;

    console.log(pokemonExists); // ano laman nito

    if (!pokemonExists)
        return pokemonNotFound;

    db.get('pokemons').update(pokemon).write();

    return {
        success: true,
    };
};
