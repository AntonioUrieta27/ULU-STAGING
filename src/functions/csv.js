export const exportCSV = (arrayHeader, delimiter = ';') => {
    let arrayData = [['Al (EXAMPLE)', 'Pachino (EXAMPLE)', 'alpacino@gmail.com(EXAMPLE)']];

    let header = arrayHeader.join(delimiter) + '\n';
    let csv = header;

    arrayData.forEach( array => {
        csv += array.join(delimiter)+"\n";
    });

    let csvData = new Blob([csv], { type: 'text/csv' });  
    let url = URL.createObjectURL(csvData);
    /*let csv = arrayHeader.join(delimiter) + '\n';
    
    console.log(csv)

    let csvData = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(csvData);
*/
    return url;
}

export const onCSVEnter = (file, cb, rol) => {
    const reader = new FileReader();

    let csvFile = new Blob([file], { type: 'text/csv' });
    
    reader.onload = function (event) {
        const text = event.target.result;
        console.log(text)
        const data = csvToArray(text);
        cb((verifyData(data)), rol); 
    }
    
    reader.readAsText(csvFile);
}

const verifyData = (data) => {
    console.log(data)
    let success = [];
    let errors = [];
    data.map(user => {
        (user.email && user.name && user.lastname) ?  success.push(user) : errors.push(user);
    })
    return {success: success, errors: errors};
}

export const csvToArray = (str, delimiter = ';') => {

    if(!str.includes(';'))  delimiter = ',';

    let cols = str.slice(0, str.indexOf('\n')).split(delimiter);
    let rows = str.slice(str.indexOf('\n') + 1).split('\n');

    if(cols.length > 3 && rows.length < 3){
        rows = cols.filter(item => item != 'email'&& item != 'lastname' && item != 'name');
        cols = cols.filter(item => item == 'email'|| item == 'lastname' || item == 'name');

        let array_helper = [];
        let intern_array = [];
        for(let i = 0; i < rows.length; i++){
            intern_array.push(rows[i]);
            if(intern_array.length == 3) {
                intern_array = intern_array.reduce((accumulator, current) => accumulator + ';' + current);
                array_helper.push(intern_array);
                intern_array = [];
            }
        }
        console.log(array_helper);
        rows = array_helper;
    }

    let array = rows.map(row => {//map
        if(row !== ''){
            const values = row.split(delimiter);
            const element = cols.reduce((obj, col, index) => {
                obj[col.trim()] = values[index].replace('\r', '');
                return obj;
            }, {});
            return element;
        }        
    });
    console.log(array)
    array = array.filter(element => element != null && element != undefined && element != '');
    //if(array.length > 1) array.pop();
    console.log(array)

    return array;
}