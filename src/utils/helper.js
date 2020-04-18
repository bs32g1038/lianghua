export const handleTime = (str = '') => {
    const arr = str.split(' ');
    let startStr = arr[0];
    if (arr.length >= 2) {
        const items = arr[1].split('-');
        if (items[1] === 'AM') {
            startStr = startStr + ' ' + items[0] + ':00';
        } else if (items[1] === 'PM') {
            startStr = startStr + ' ' + parseInt(items[0]) + 12 + ':00';
        }
    }
    return startStr;
};
