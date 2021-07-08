const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);

db.defaults({ pokemons: [] }).write();

const getByName = name => {
    if (name) {
        const LowercaseName = name.trim().toLowerCase();
        const pokemon =
            db.get('pokemons')
                .value()
                .filter((_) => _.name.trim().toLowerCase() === LowercaseName);

        if (pokemon.length > 0) {
            return {
                success: true,
                data: pokemon[0]
            };
        }
        else {
            return {
                success: false,
                errorMessage: `Pokemon '${name}' does not exist.`,
            };
        }
    }
}

exports.get = (name) => {
    if (!name) {
        const pokemons = db.get('pokemons').value();
        return pokemons;
    }

    const LowercaseName = name.trim().toLowerCase();
    const pokemon =
        db.get('pokemons')
            .value()
            .filter((_) => _.name.trim().toLowerCase() === LowercaseName);

    if (pokemon.length > 0) {
        return pokemon;
    }
    else {
        return {
            success: false,
            errorMessage: `Pokemon '${name}' does not exist.`,
        };
    }
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

exports.delete = (name) => {
    const result = getByName(name);
    const { success, data } = result;

    if (!success) {
        //return error
        return result;
    }

    const pokemons = db.get('pokemons').value();
    const allExcept = pokemons.filter(_ => _.name !== data.name);
    db.set('pokemons', allExcept).write();

    return {
        success: true,
    };
};