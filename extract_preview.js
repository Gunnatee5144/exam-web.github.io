const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('../2566 รังสีวินิจฉัย - เฉลย.pdf.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 3000));
}).catch(err => {
    console.error(err);
});