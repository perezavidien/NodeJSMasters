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

        if (pokemon.length === 0) {
            return {
                success: false,
                errorMessage: `Pokemon '${name}' does not exist.`,
            };
        }

        return {
            success: true,
            data: pokemon[0]
        };
    }
};

exports.get = (name) => {
    if (!name) {
        const pokemons = db.get('pokemons').value();
        return pokemons;
    }

    const result = getByName(name);
    const { success, data } = result;

    if (!success) {
        //return error if pokemon does not exist
        return result;
    }

    return data;
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

exports.update = (name, body) => {
    //validations
    const { type, generation } = body
    if (!type) {
        return {
            success: false,
            errorMessage: `Type value is required.`
        }
    }

    //get  targeted pokemon
    const result = getByName(name);
    const { success, data } = result;

    if (!success) {
        //return error if pokemon does not exist
        return result;
    }

    //update the values

    //type is mandatory
    data.type = type;
    //generation optional
    if (generation !== undefined) {
        data.generation = generation;
    }

    console.log(data);

    const pokemons = db
        .get('pokemons')
        .value()
        .filter(_ => _.name !== data.name);

    pokemons.push(data);
    db.set('pokemons', pokemons).write();

    return {
        success: true
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
        success: true
    };
};