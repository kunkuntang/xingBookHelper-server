var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx5b7c2e620cd2e7ea&secret=75ebd780c4aa483bce0dc23072dd40bf&js_code=' + req.body.jsCode + '&grant_type=authorization_code'

function requestWx(url, cb) {
    https.get(url, function (res) {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        console.log('raw data', rawData)
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                console.log(parsedData);
                cb(parsedData)
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    })
}

module.exports = requestWx