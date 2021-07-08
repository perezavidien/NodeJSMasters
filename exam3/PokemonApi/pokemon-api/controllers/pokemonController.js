const { pokemonService } = require('../services');
const url = require('url');

exports.handleGetRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const nameParam = queryObject?.name;

    const data = pokemonService.get(nameParam);
    const result = { data };

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
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));
        res.end();
    });
};

// avi todo
exports.handlePutRequest = (req, res) => {

    res.write('update called');
    res.end();
};

// avi todo
exports.handleDeleteRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const nameParam = queryObject?.name;

    const data = pokemonService.delete(nameParam);
    const result = { data };

    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify(result));
    res.end();
};