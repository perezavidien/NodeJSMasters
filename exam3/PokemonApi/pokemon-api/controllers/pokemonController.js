const { pokemonService } = require('../services');
const url = require('url');

exports.handleGetRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const nameParam = queryObject?.name;

    const result = pokemonService.get(nameParam);

    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify(result));
    res.end();
};

exports.handlePostRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const result = pokemonService.insert(dataJson);

        if (!result.success) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
            res.end();
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
            res.end();
        }
    });
};

// avi todo
exports.handlePutRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        //type mandatory
        //generation optional
        //if type exists, update

        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);
        const queryObject = url.parse(req.url, true).query;
        const nameParam = queryObject?.name;

        const result = pokemonService.update(nameParam, dataJson);

        if (!result.success) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
            res.end();
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
            res.end();
        }
    });
};

exports.handleDeleteRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const nameParam = queryObject?.name;
    const result = pokemonService.delete(nameParam);

    if (!result.success) {
        res.writeHead(400, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));
        res.end();
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));
        res.end();
    }
};