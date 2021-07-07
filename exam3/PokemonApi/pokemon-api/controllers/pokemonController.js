const { pokemonService } = require('../services');
const url = require('url');

exports.handleGetRequest = (req, res) => {
    console.log(req.url);
    console.log(req.method);
    console.log(req.statusCode);

    //get the query param name value
    //then pass to this get()

    const data = pokemonService.get('Lucario');
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

    res.write('delete called');
    res.end();
};